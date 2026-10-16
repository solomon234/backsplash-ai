import { ref, onBeforeUnmount } from 'vue'
import type { ImageSegmenter } from '@mediapipe/tasks-vision'

// Pinned so the WASM runtime always matches the installed JS package.
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.1/wasm'
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite'

export type CameraStatus = 'off' | 'starting' | 'on'

/**
 * Streams the webcam and draws only the person (background removed) onto a transparent canvas,
 * so it can be layered over the generated background in the preview.
 */
export function useCameraCutout() {
  const status = ref<CameraStatus>('off')
  const error = ref<string>('')

  let stream: MediaStream | null = null
  let video: HTMLVideoElement | null = null
  let segmenter: ImageSegmenter | null = null
  let canvas: HTMLCanvasElement | null = null
  let frameId = 0
  let lastVideoTime = -1

  // Reused every frame: the person layer (video + mask) and the low-res mask. Created in start() so SSR never touches the DOM.
  let personLayer: HTMLCanvasElement | null = null
  let maskLayer: HTMLCanvasElement | null = null

  async function loadSegmenter() {
    if (segmenter) return segmenter
    const { FilesetResolver, ImageSegmenter } = await import('@mediapipe/tasks-vision')
    const vision = await FilesetResolver.forVisionTasks(WASM_URL)
    segmenter = await ImageSegmenter.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
      runningMode: 'VIDEO',
      outputCategoryMask: false,
      outputConfidenceMasks: true
    })
    return segmenter
  }

  function drawFrame() {
    if (!video || !canvas || !segmenter || !personLayer || !maskLayer) return
    frameId = requestAnimationFrame(drawFrame)
    if (video.readyState < 2 || video.currentTime === lastVideoTime) return
    lastVideoTime = video.currentTime

    segmenter.segmentForVideo(video, performance.now(), (result) => {
      const mask = result.confidenceMasks?.[0]
      if (!mask || !canvas || !video || !personLayer || !maskLayer) return
      const data = mask.getAsFloat32Array()

      // Confidence -> alpha, kept at the model's resolution and upscaled with smoothing for soft edges.
      if (maskLayer.width !== mask.width || maskLayer.height !== mask.height) {
        maskLayer.width = mask.width
        maskLayer.height = mask.height
      }
      const mctx = maskLayer.getContext('2d')!
      const img = mctx.createImageData(mask.width, mask.height)
      for (let i = 0; i < data.length; i++) {
        // Smoothstep between 0.35 and 0.65 firms up the edge and drops the faint halo of low-confidence pixels.
        const t = Math.min(1, Math.max(0, (data[i]! - 0.35) / 0.3))
        img.data[i * 4 + 3] = Math.round(t * t * (3 - 2 * t) * 255)
      }
      mctx.putImageData(img, 0, 0)

      const w = video.videoWidth
      const h = video.videoHeight
      if (personLayer.width !== w || personLayer.height !== h) {
        personLayer.width = w
        personLayer.height = h
      }
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }

      const pctx = personLayer.getContext('2d')!
      pctx.globalCompositeOperation = 'source-over'
      pctx.clearRect(0, 0, w, h)
      pctx.drawImage(video, 0, 0, w, h)
      pctx.globalCompositeOperation = 'destination-in'
      pctx.imageSmoothingEnabled = true
      pctx.drawImage(maskLayer, 0, 0, w, h)

      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(personLayer, 0, 0)
    })
  }

  async function start(target: HTMLCanvasElement) {
    if (status.value !== 'off') return
    status.value = 'starting'
    error.value = ''
    canvas = target
    personLayer = document.createElement('canvas')
    maskLayer = document.createElement('canvas')
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access is not supported in this browser (it also needs https or localhost).')
      }
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false
      })
      video = document.createElement('video')
      video.srcObject = stream
      video.muted = true
      video.playsInline = true
      await video.play()
      await loadSegmenter()
      lastVideoTime = -1
      status.value = 'on'
      drawFrame()
    } catch (err) {
      stop()
      const e = err as { name?: string, message?: string }
      error.value = e.name === 'NotAllowedError'
        ? 'Camera permission was denied. Allow camera access for this site and try again.'
        : e.name === 'NotFoundError'
          ? 'No camera was found on this device.'
          : e.message || 'Could not start the camera.'
    }
  }

  function stop() {
    cancelAnimationFrame(frameId)
    stream?.getTracks().forEach(t => t.stop())
    stream = null
    if (video) video.srcObject = null
    video = null
    if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
    canvas = null
    status.value = 'off'
  }

  onBeforeUnmount(() => {
    stop()
    segmenter?.close()
    segmenter = null
  })

  return { status, error, start, stop }
}
