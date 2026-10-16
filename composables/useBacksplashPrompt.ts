import { ref, computed } from 'vue'

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

export interface PresetBackground {
  id: string
  title: string
  category: 'professional' | 'whimsical'
  prompt: string
  bgUrl: string
  blurPx: number
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

  // Custom prompt input for custom mode
  const rawCustomPrompt = ref<string>('')

  // UI state
  const backgroundBlur = ref<number>(0)
  const isGenerating = ref<boolean>(false)
  const generationProgress = ref<number>(0)
  const isCopied = ref<boolean>(false)
  const activeBackgroundUrl = ref<string>('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop')

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

  function generateBackground() {
    if (isGenerating.value) return
    isGenerating.value = true
    generationProgress.value = 0

    const interval = setInterval(() => {
      generationProgress.value += 20
      if (generationProgress.value >= 100) {
        clearInterval(interval)
        isGenerating.value = false
        const sampleBgImages = [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop'
        ]
        const randomIndex = Math.floor(Math.random() * sampleBgImages.length)
        activeBackgroundUrl.value = sampleBgImages[randomIndex]
      }
    }, 200)
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

  const presetGallery: PresetBackground[] = [
    {
      id: 'p1',
      title: 'Executive Corner Suite',
      category: 'professional',
      prompt: 'A professional video call background image, Executive Suite. Spacious corner office with floor-to-ceiling glass windows overlooking a sunlit metropolis. Warm oak tones, Monstera plant.',
      bgUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
      blurPx: 0
    },
    {
      id: 'p2',
      title: 'Architectural Wood Loft',
      category: 'professional',
      prompt: 'Architectural loft workspace with acoustic wood slat wall, brass minimalist desk lamp, subtle monstera plant and soft window key light.',
      bgUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop',
      blurPx: 2
    },
    {
      id: 'p3',
      title: 'Modern Curated Library',
      category: 'professional',
      prompt: 'Curated modern library shelf with warm lighting, leather-bound books, abstract geometric art, soft background blur.',
      bgUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
      blurPx: 0
    },
    {
      id: 'w1',
      title: 'Cyberpunk Neon Observatory',
      category: 'whimsical',
      prompt: 'Cyberpunk futuristic office observatory overlooking a glowing rainy metropolis with purple and cyan neon backlighting.',
      bgUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop',
      blurPx: 0
    },
    {
      id: 'w2',
      title: 'Cosmic Nebula Cloud Lounge',
      category: 'whimsical',
      prompt: 'Dreamy cosmic cloud castle room floating above starry nebulas, glowing crystals and iridescent soft lighting.',
      bgUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      blurPx: 1
    }
  ]

  function applyPreset(preset: PresetBackground) {
    activeBackgroundUrl.value = preset.bgUrl
    backgroundBlur.value = preset.blurPx
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
    backgroundBlur,
    isGenerating,
    generationProgress,
    isCopied,
    activeBackgroundUrl,
    presetGallery,
    generatedPrompt,
    selectMode,
    applyTheme,
    toggleDecor,
    toggleQuality,
    generateBackground,
    copyPrompt,
    resetToDefaults,
    surpriseMe,
    applyPreset
  }
}
