<template>
  <UCard class="bg-slate-900/60 border-slate-800">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 class="text-base font-semibold text-slate-100 flex items-center gap-2 whitespace-nowrap">
          Video Call Live Preview
        </h2>
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2 [&_button]:whitespace-nowrap">
          <UButton
            size="xs"
            color="neutral"
            :variant="camera.status.value === 'on' ? 'solid' : 'outline'"
            :icon="camera.status.value === 'on' ? 'i-heroicons-video-camera-slash' : 'i-heroicons-video-camera'"
            :loading="camera.status.value === 'starting'"
            @click="toggleCamera"
          >
            {{ camera.status.value === 'on' ? 'Stop camera' : camera.status.value === 'starting' ? 'Starting…' : 'Use camera' }}
          </UButton>
          <UButton
            size="xs"
            color="neutral"
            variant="outline"
            icon="i-heroicons-arrow-down-tray"
            :disabled="isGenerating"
            @click="$emit('download')"
          >
            Download
          </UButton>
          <div class="flex items-center gap-1.5">
            <span class="text-xs text-slate-400 whitespace-nowrap">Background Blur:</span>
            <input
              type="range"
              min="0"
              max="12"
              :value="backgroundBlur"
              @input="$emit('update:backgroundBlur', Number(($event.target as HTMLInputElement).value))"
              class="w-20 accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span class="text-xs font-mono text-slate-300 w-6">{{ backgroundBlur }}px</span>
          </div>
        </div>
      </div>
    </template>

    <div class="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950 flex items-center justify-center">
      <!-- Generated Background Image -->
      <img
        :src="activeBackgroundUrl"
        alt="Backsplash AI Background"
        class="absolute inset-0 w-full h-full object-cover transition-all duration-300"
        :style="{ filter: `blur(${backgroundBlur}px)` }"
      />

      <!-- Video Call HUD Overlay Header -->
      <div class="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
        <div class="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-full px-3 py-1 text-xs text-slate-200 font-medium flex items-center gap-2 shadow-lg">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Meeting: Project Review (16:9 4K)</span>
        </div>
        <div class="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-full px-2.5 py-1 text-xs text-red-400 font-semibold flex items-center gap-1.5 shadow-lg">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          • REC
        </div>
      </div>

      <!-- Live camera cutout (person only, mirrored like a self-view) -->
      <canvas
        ref="cameraCanvas"
        class="absolute inset-0 z-10 w-full h-full object-cover -scale-x-100 pointer-events-none"
        :class="camera.status.value === 'on' ? '' : 'hidden'"
      />

      <!-- User Silhouette Overlay (placeholder until the camera is on) -->
      <div v-if="camera.status.value !== 'on'" class="absolute bottom-0 z-10 w-full flex justify-center pointer-events-none">
        <div class="relative w-64 h-56 flex flex-col items-center justify-end">
          <div class="w-28 h-28 rounded-full bg-slate-800/90 border-2 border-slate-600/60 shadow-xl flex items-center justify-center -mb-8 z-10 backdrop-blur-xs">
            <UIcon name="i-heroicons-user" class="w-16 h-16 text-slate-400/80" />
          </div>
          <div class="w-56 h-32 rounded-t-full bg-slate-800/90 border-t-2 border-x-2 border-slate-600/60 backdrop-blur-xs shadow-2xl" />
        </div>
      </div>

      <!-- Generation Loading Overlay -->
      <div
        v-if="isGenerating"
        class="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6"
      >
        <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-indigo-400 animate-spin mb-3" />
        <p class="text-sm font-medium text-slate-200 mb-2">Generating AI Backsplash...</p>
        <div class="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            class="bg-gradient-to-r from-indigo-500 to-pink-500 h-full transition-all duration-200"
            :style="{ width: `${generationProgress}%` }"
          />
        </div>
      </div>

      <!-- Video Call Controls Footer -->
      <div class="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 z-10">
        <div
          v-if="displayName.trim() || jobTitle.trim()"
          class="max-w-[60%] bg-slate-900/85 backdrop-blur-md border-l-4 border-indigo-500 rounded-md px-3 py-1.5 shadow-lg"
        >
          <div v-if="displayName.trim()" class="text-sm font-semibold text-white truncate">{{ displayName }}</div>
          <div v-if="jobTitle.trim()" class="text-xs text-slate-300 truncate">{{ jobTitle }}</div>
        </div>
        <div v-else />
        <div class="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 flex items-center gap-2">
          <UIcon name="i-heroicons-video-camera" class="w-3.5 h-3.5 text-emerald-400" />
          <span>163 ms</span>
          <UIcon name="i-heroicons-signal" class="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const toast = useToast()
const camera = useCameraCutout()
const cameraCanvas = ref<HTMLCanvasElement | null>(null)

function toggleCamera() {
  if (camera.status.value === 'on') camera.stop()
  else if (cameraCanvas.value) camera.start(cameraCanvas.value)
}

watch(camera.error, (message) => {
  if (message) toast.add({ title: 'Camera unavailable', description: message, color: 'error' })
})

defineProps<{
  backgroundBlur: number
  activeBackgroundUrl: string
  displayName: string
  jobTitle: string
  isGenerating: boolean
  generationProgress: number
}>()

defineEmits<{
  (e: 'update:backgroundBlur', value: number): void
  (e: 'download'): void
}>()
</script>
