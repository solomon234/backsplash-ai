import { ref, computed, onMounted } from 'vue'

export type BacksplashMode = 'professional' | 'whimsical' | 'custom'

export interface ThemeOption {
  id: string
  label: string
  icon: string
  description: string
  defaultDecor: string[]
  defaultLighting: string
  defaultPalette: string
}

export interface OptionItem {
  id: string
  label: string
  desc: string
}

export interface PaletteItem {
  id: string
  label: string
  colors: string[]
}

export interface QualityModifier {
  id: string
  label: string
}

export function useBacksplashPrompt() {
  const currentMode = ref<BacksplashMode>('professional')

  const professionalThemes: ThemeOption[] = [
    {
      id: 'executive',
      label: 'Executive Suite',
      icon: 'i-heroicons-building-office',
      description: 'Spacious corner office with floor-to-ceiling glass windows overlooking a sunlit metropolis',
      defaultDecor: ['Potted Monstera Plant', 'Wooden Bookcase', 'Brass Desk Lamp'],
      defaultLighting: 'golden-hour',
      defaultPalette: 'oak-beige'
    },
    {
      id: 'library',
      label: 'Modern Library',
      icon: 'i-heroicons-book-open',
      description: 'Warm study filled with curated books, subtle ambient light, and acoustic wood paneling',
      defaultDecor: ['Hardcover Book Collection', 'Soft Warm Lamp', 'Acoustic Wood Paneling'],
      defaultLighting: 'studio-soft',
      defaultPalette: 'charcoal-white'
    },
    {
      id: 'loft',
      label: 'Architectural Loft',
      icon: 'i-heroicons-home-modern',
      description: 'Exposed brick industrial loft with minimalist shelving and modern minimalist art framing',
      defaultDecor: ['Abstract Framed Art', 'Acoustic Wood Paneling', 'Sleek Glass Desk'],
      defaultLighting: 'natural-daylight',
      defaultPalette: 'navy-brass'
    },
    {
      id: 'minimalist',
      label: 'Minimalist Workspace',
      icon: 'i-heroicons-computer-desktop',
      description: 'Clean monochrome setup with subtle shadows, soft backlight, and zero clutter',
      defaultDecor: ['Sleek Glass Desk', 'Potted Monstera Plant', 'Brass Desk Lamp'],
      defaultLighting: 'studio-soft',
      defaultPalette: 'charcoal-white'
    }
  ]

  const whimsicalThemes: ThemeOption[] = [
    {
      id: 'cosmic',
      label: 'Cosmic Nebula Lounge',
      icon: 'i-heroicons-sparkles',
      description: 'Floating glass observatory surrounded by swirling purple and teal galaxies with floating starbursts',
      defaultDecor: ['Floating Crystals', 'Glowing Hologram Grid', 'Neon Plant'],
      defaultLighting: 'neon',
      defaultPalette: 'neon-cyber'
    },
    {
      id: 'enchanted',
      label: 'Enchanted Forest Study',
      icon: 'i-heroicons-sun',
      description: 'Cozy treehouse interior surrounded by glowing bioluminescent mushrooms and mossy wood beams',
      defaultDecor: ['Bioluminescent Mushrooms', 'Vintage Telescope', 'Floating Crystals'],
      defaultLighting: 'golden-hour',
      defaultPalette: 'emerald-gold'
    },
    {
      id: 'cyberpunk',
      label: 'Cyberpunk HQ',
      icon: 'i-heroicons-cpu-chip',
      description: 'Futuristic high-tech apartment overlooking a rainy neon city with glowing holographic displays',
      defaultDecor: ['Glowing Hologram Grid', 'Neon Plant', 'Vintage Telescope'],
      defaultLighting: 'neon',
      defaultPalette: 'neon-cyber'
    },
    {
      id: 'pastel',
      label: 'Cloud Castle Cafe',
      icon: 'i-heroicons-cloud',
      description: 'Dreamy pastel studio floating on cotton candy clouds with rainbow prismatic sunlight rays',
      defaultDecor: ['Floating Crystals', 'Abstract Framed Art', 'Soft Sheer Curtains'],
      defaultLighting: 'studio-soft',
      defaultPalette: 'oak-beige'
    }
  ]

  const currentThemeList = computed(() => {
    return currentMode.value === 'whimsical' ? whimsicalThemes : professionalThemes
  })

  const selectedTheme = ref<string>('executive')
  const customScene = ref<string>('Spacious corner office with floor-to-ceiling glass windows overlooking a sunlit metropolis')

  const availableDecor = [
    'Potted Monstera Plant',
    'Wooden Bookcase',
    'Brass Desk Lamp',
    'Abstract Framed Art',
    'Acoustic Wood Paneling',
    'Sleek Glass Desk',
    'Soft Sheer Curtains',
    'Floating Crystals',
    'Glowing Hologram Grid',
    'Bioluminescent Mushrooms',
    'Vintage Telescope',
    'Neon Plant'
  ]
  const selectedDecor = ref<string[]>(['Potted Monstera Plant', 'Wooden Bookcase', 'Brass Desk Lamp'])

  const lightingOptions: OptionItem[] = [
    { id: 'golden-hour', label: 'Golden Hour', desc: 'Warm ambient sunset glow through windows' },
    { id: 'studio-soft', label: 'Soft Studio Light', desc: 'Diffused professional key lighting' },
    { id: 'natural-daylight', label: 'Crisp Natural Daylight', desc: 'Clean, energetic daylight' },
    { id: 'neon', label: 'Neon Atmosphere', desc: 'Vibrant blue & magenta backlighting' }
  ]
  const selectedLighting = ref<string>('golden-hour')

  const colorPalettes: PaletteItem[] = [
    { id: 'oak-beige', label: 'Warm Oak & Beige', colors: ['#D4A373', '#FAEDCD', '#E9EDC9'] },
    { id: 'navy-brass', label: 'Executive Navy & Brass', colors: ['#1D3557', '#457B9D', '#E0A96D'] },
    { id: 'charcoal-white', label: 'Charcoal & White', colors: ['#2B2D42', '#8D99AE', '#EDF2F4'] },
    { id: 'neon-cyber', label: 'Cyberpunk Neon', colors: ['#7209B7', '#4CC9F0', '#F72585'] },
    { id: 'emerald-gold', label: 'Enchanted Emerald', colors: ['#132A13', '#315C2B', '#ECF39E'] }
  ]
  const selectedPalette = ref<string>('oak-beige')

  const qualityModifiers: QualityModifier[] = [
    { id: 'shallow-depth', label: 'Shallow depth of field (blurred background focus)' },
    { id: 'photorealistic', label: '8k resolution, photorealistic architectural photography' },
    { id: 'cinematic', label: 'Cinematic lighting, clean composition, perfectly framed for 16:9 aspect ratio' },
    { id: 'no-people', label: 'Empty room, no people in view, subtle background depth' }
  ]
  const selectedQualities = ref<string[]>([
    'shallow-depth',
    'photorealistic',
    'cinematic',
    'no-people'
  ])

  // Name tag shown on the video preview
  const displayName = ref<string>('')
  const jobTitle = ref<string>('')

  // Custom prompt input for custom mode
  const rawCustomPrompt = ref<string>('')

  // UI state
  const toast = useToast()
  const usage = ref<{ used: number, limit: number, remaining: number, resetsAt: string } | null>(null)
  const backgroundBlur = ref<number>(0)
  const isGenerating = ref<boolean>(false)
  const generationProgress = ref<number>(0)
  const isCopied = ref<boolean>(false)
  const activeBackgroundUrl = ref<string>('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop')

  onMounted(refreshUsage)

  function selectMode(mode: BacksplashMode) {
    currentMode.value = mode
    if (mode === 'professional') {
      applyTheme(professionalThemes[0])
    } else if (mode === 'whimsical') {
      applyTheme(whimsicalThemes[0])
    }
  }

  function applyTheme(theme: ThemeOption) {
    selectedTheme.value = theme.id
    customScene.value = theme.description
    selectedDecor.value = [...theme.defaultDecor]
    selectedLighting.value = theme.defaultLighting
    selectedPalette.value = theme.defaultPalette
  }

  function toggleDecor(item: string) {
    if (selectedDecor.value.includes(item)) {
      selectedDecor.value = selectedDecor.value.filter(d => d !== item)
    } else {
      selectedDecor.value.push(item)
    }
  }

  function toggleQuality(id: string) {
    if (selectedQualities.value.includes(id)) {
      selectedQualities.value = selectedQualities.value.filter(q => q !== id)
    } else {
      selectedQualities.value.push(id)
    }
  }

  const generatedPrompt = computed(() => {
    if (currentMode.value === 'custom' && rawCustomPrompt.value.trim().length > 0) {
      return rawCustomPrompt.value.trim()
    }

    const modePrefix = currentMode.value === 'professional'
      ? 'A professional video call background image, '
      : 'A creative and whimsical video call background, '

    const themeObj = currentThemeList.value.find(t => t.id === selectedTheme.value)
    const themeLabel = themeObj ? themeObj.label : ''

    const sceneText = customScene.value ? `${customScene.value}. ` : ''
    const decorText = selectedDecor.value.length > 0
      ? `featuring ${selectedDecor.value.join(', ')}. `
      : ''

    const lightingObj = lightingOptions.find(l => l.id === selectedLighting.value)
    const lightingText = lightingObj ? `illuminated with ${lightingObj.desc.toLowerCase()}. ` : ''

    const paletteObj = colorPalettes.find(p => p.id === selectedPalette.value)
    const paletteText = paletteObj ? `color scheme in ${paletteObj.label.toLowerCase()}. ` : ''

    const qualitiesText = selectedQualities.value.length > 0
      ? selectedQualities.value.map(id => qualityModifiers.find(q => q.id === id)?.label).filter(Boolean).join(', ') + '.'
      : ''

    return `${modePrefix}${themeLabel}. ${sceneText}${decorText}${lightingText}${paletteText}${qualitiesText}`
  })

  async function refreshUsage() {
    try {
      usage.value = await $fetch('/api/usage')
    } catch {
      // The counter is informational; generation still enforces the cap server-side.
    }
  }

  const limitReached = computed(() => usage.value !== null && usage.value.remaining <= 0)

  async function generateBackground() {
    if (isGenerating.value || limitReached.value) return
    isGenerating.value = true
    generationProgress.value = 0

    // The model gives no progress events, so ease toward 90% until the response lands.
    const interval = setInterval(() => {
      generationProgress.value = Math.min(90, generationProgress.value + 5)
    }, 300)

    try {
      const { image, usage: latest } = await $fetch<{ image: string, usage: NonNullable<typeof usage.value> }>('/api/generate', {
        method: 'POST',
        body: { prompt: generatedPrompt.value }
      })
      activeBackgroundUrl.value = image
      usage.value = latest
      backgroundBlur.value = 0
      generationProgress.value = 100
    } catch (err) {
      const message = (err as { statusMessage?: string, data?: { statusMessage?: string } })?.data?.statusMessage
        ?? (err as { statusMessage?: string })?.statusMessage
        ?? 'Image generation failed.'
      toast.add({ title: 'Could not generate background', description: message, color: 'error' })
    } finally {
      clearInterval(interval)
      isGenerating.value = false
      // Re-sync after every attempt: a 429 or failure changes the server's count.
      void refreshUsage()
    }
  }

  // Mirrors the preview's name tag (bottom-left). Sizes scale with the image so it matches the preview at any resolution.
  function drawNameTag(ctx: CanvasRenderingContext2D, width: number, height: number, name: string, title: string) {
    const u = width / 545 // the preview frame is ~545px wide
    const font = '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif'
    const nameSize = 14 * u
    const titleSize = 12 * u
    const padX = 12 * u
    const padY = 6 * u
    const bar = 4 * u
    const margin = 12 * u
    const maxTextWidth = width * 0.6 - padX * 2 - bar

    const fit = (text: string) => {
      if (ctx.measureText(text).width <= maxTextWidth) return text
      let t = text
      while (t.length > 1 && ctx.measureText(`${t}…`).width > maxTextWidth) t = t.slice(0, -1)
      return `${t}…`
    }

    ctx.textBaseline = 'top'
    const lines: { text: string, size: number, weight: number, color: string }[] = []
    if (name) lines.push({ text: name, size: nameSize, weight: 600, color: '#ffffff' })
    if (title) lines.push({ text: title, size: titleSize, weight: 400, color: '#cbd5e1' })
    for (const l of lines) {
      ctx.font = `${l.weight} ${l.size}px ${font}`
      l.text = fit(l.text)
    }

    const lineGap = 2 * u
    const textWidth = Math.max(...lines.map((l) => {
      ctx.font = `${l.weight} ${l.size}px ${font}`
      return ctx.measureText(l.text).width
    }))
    const boxW = bar + padX * 2 + textWidth
    const boxH = padY * 2 + lines.reduce((sum, l) => sum + l.size * 1.3, 0) + lineGap * (lines.length - 1)
    const x = margin
    const y = height - margin - boxH

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
    ctx.beginPath()
    ctx.roundRect(x, y, boxW, boxH, 6 * u)
    ctx.fill()
    ctx.save()
    ctx.clip()
    ctx.fillStyle = '#6366f1'
    ctx.fillRect(x, y, bar, boxH)
    ctx.restore()

    let ty = y + padY
    for (const l of lines) {
      ctx.font = `${l.weight} ${l.size}px ${font}`
      ctx.fillStyle = l.color
      ctx.fillText(l.text, x + bar + padX, ty + l.size * 0.15)
      ty += l.size * 1.3 + lineGap
    }
  }

  // Saves the background cropped to 16:9 (what video-call apps expect), with the name tag if one is filled in.
  // The silhouette and call HUD from the preview are never included.
  async function downloadBackground() {
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = activeBackgroundUrl.value
      await img.decode()

      const targetRatio = 16 / 9
      let sw = img.naturalWidth
      let sh = img.naturalHeight
      if (sw / sh > targetRatio) sw = Math.round(sh * targetRatio)
      else sh = Math.round(sw / targetRatio)
      const sx = Math.round((img.naturalWidth - sw) / 2)
      const sy = Math.round((img.naturalHeight - sh) / 2)

      const canvas = document.createElement('canvas')
      canvas.width = sw
      canvas.height = sh
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)

      const name = displayName.value.trim()
      const title = jobTitle.value.trim()
      if (name || title) {
        await document.fonts.load('600 16px "Plus Jakarta Sans"').catch(() => {})
        drawNameTag(ctx, sw, sh, name, title)
      }

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95))
      if (!blob) throw new Error('Could not encode image')

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'backsplash.jpg'
      // Firefox/Safari only honour the click when the link is in the DOM, and revoking too early cancels the save.
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 10_000)
    } catch {
      toast.add({ title: 'Could not download background', description: 'The image could not be exported. Try generating a new one.', color: 'error' })
    }
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(generatedPrompt.value)
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    } catch {
      // fallback
    }
  }

  function resetToDefaults() {
    if (currentMode.value === 'professional') {
      applyTheme(professionalThemes[0])
    } else if (currentMode.value === 'whimsical') {
      applyTheme(whimsicalThemes[0])
    }
  }

  function surpriseMe() {
    const theme = currentThemeList.value[Math.floor(Math.random() * currentThemeList.value.length)]
    applyTheme(theme)

    // Randomize decor selection
    const shuffled = [...availableDecor].sort(() => 0.5 - Math.random())
    selectedDecor.value = shuffled.slice(0, 3)

    // Randomize lighting and palette
    selectedLighting.value = lightingOptions[Math.floor(Math.random() * lightingOptions.length)].id
    selectedPalette.value = colorPalettes[Math.floor(Math.random() * colorPalettes.length)].id
  }

  return {
    currentMode,
    professionalThemes,
    whimsicalThemes,
    currentThemeList,
    selectedTheme,
    customScene,
    availableDecor,
    selectedDecor,
    lightingOptions,
    selectedLighting,
    colorPalettes,
    selectedPalette,
    qualityModifiers,
    selectedQualities,
    rawCustomPrompt,
    displayName,
    jobTitle,
    backgroundBlur,
    isGenerating,
    generationProgress,
    isCopied,
    activeBackgroundUrl,
    generatedPrompt,
    selectMode,
    applyTheme,
    toggleDecor,
    toggleQuality,
    generateBackground,
    usage,
    limitReached,
    refreshUsage,
    copyPrompt,
    downloadBackground,
    resetToDefaults,
    surpriseMe
  }
}
