<template>
  <div class="backsplash-app">
    <!-- Navbar Header -->
    <header class="navbar">
      <div class="brand">
        <div class="logo-icon">
          <UIcon name="i-heroicons-sparkles" class="w-6 h-6 text-white" />
        </div>
        <div class="brand-text">
          <h1>Backsplash AI</h1>
          <p class="tagline">Craft perfect AI backgrounds for video calls with Nuxt UI</p>
        </div>
      </div>

      <!-- Mode Selector Tabs using UButton / UIcon -->
      <div class="mode-tabs">
        <UButton
          v-for="mode in modes"
          :key="mode.id"
          :variant="currentMode === mode.id ? 'solid' : 'ghost'"
          :color="currentMode === mode.id ? (mode.id === 'professional' ? 'primary' : mode.id === 'whimsical' ? 'pink' : 'purple') : 'neutral'"
          size="sm"
          class="mode-btn"
          @click="selectMode(mode.id)"
        >
          <span class="mode-emoji">{{ mode.emoji }}</span>
          <span>{{ mode.label }}</span>
        </UButton>
      </div>
    </header>

    <!-- Main Container Grid -->
    <main class="content-grid">
      <!-- Left Column: Input Form & Prompt Builder -->
      <UCard class="builder-panel">
        <div class="panel-header">
          <div class="header-title">
            <h2>Backsplash Controls</h2>
            <UBadge
              :color="currentMode === 'professional' ? 'info' : currentMode === 'whimsical' ? 'pink' : 'purple'"
              variant="subtle"
              size="md"
            >
              {{ currentMode === 'professional' ? '💼 Professional' : currentMode === 'whimsical' ? '🎨 Whimsical' : '⚙️ Custom' }} Mode
            </UBadge>
          </div>
          <UButton
            color="neutral"
            variant="outline"
            size="xs"
            icon="i-heroicons-sparkles"
            @click="randomizePrompt"
            title="Generate random combo"
          >
            🎲 Surprise Me
          </UButton>
        </div>

        <!-- 1. Category / Environment Preset -->
        <div class="control-group">
          <label class="group-label">
            <span>Environment Theme</span>
            <small>Select background setting</small>
          </label>
          <div class="pill-grid">
            <UButton
              v-for="cat in availableCategories"
              :key="cat.id"
              :variant="selectedCategory === cat.id ? 'soft' : 'outline'"
              :color="selectedCategory === cat.id ? 'primary' : 'neutral'"
              size="sm"
              class="pill-btn justify-start"
              @click="selectedCategory = cat.id"
            >
              <span class="pill-icon">{{ cat.icon }}</span>
              <span>{{ cat.name }}</span>
            </UButton>
          </div>
        </div>

        <!-- 2. Scene Description -->
        <div class="control-group">
          <label class="group-label" for="scene-input">
            <span>Scene Description</span>
            <small>Core room features & architecture</small>
          </label>
          <UInput
            id="scene-input"
            v-model="sceneDescription"
            placeholder="e.g. Minimalist corner office with tall floor-to-ceiling windows"
            icon="i-heroicons-pencil-square"
            size="sm"
            class="w-full"
          />
        </div>

        <!-- 3. Key Objects & Decor (Multi-select) -->
        <div class="control-group">
          <label class="group-label">
            <span>Decor & Elements</span>
            <small>Select key items in view</small>
          </label>
          <div class="tags-grid">
            <UButton
              v-for="tag in availableDecorTags"
              :key="tag"
              :variant="selectedDecor.includes(tag) ? 'soft' : 'subtle'"
              :color="selectedDecor.includes(tag) ? 'primary' : 'neutral'"
              size="xs"
              class="rounded-full"
              @click="toggleDecor(tag)"
            >
              <UIcon v-if="selectedDecor.includes(tag)" name="i-heroicons-check" class="w-3.5 h-3.5 mr-1" />
              <span>{{ tag }}</span>
            </UButton>
          </div>
        </div>

        <!-- 4. Lighting & Atmosphere -->
        <div class="control-group">
          <label class="group-label">
            <span>Lighting & Vibe</span>
          </label>
          <div class="option-row">
            <div
              v-for="light in lightingOptions"
              :key="light.id"
              class="option-card"
              :class="{ active: selectedLighting === light.id }"
              @click="selectedLighting = light.id"
            >
              <span class="option-title">{{ light.name }}</span>
              <span class="option-desc">{{ light.desc }}</span>
            </div>
          </div>
        </div>

        <!-- 5. Color Palette -->
        <div class="control-group">
          <label class="group-label">
            <span>Color Palette</span>
          </label>
          <div class="color-swatch-grid">
            <div
              v-for="palette in colorPalettes"
              :key="palette.id"
              class="swatch-btn"
              :class="{ active: selectedPalette === palette.id }"
              @click="selectedPalette = palette.id"
            >
              <div class="swatch-colors">
                <span v-for="(color, idx) in palette.colors" :key="idx" :style="{ backgroundColor: color }"></span>
              </div>
              <span class="swatch-name">{{ palette.name }}</span>
            </div>
          </div>
        </div>

        <!-- 6. Quality Modifiers -->
        <div class="control-group">
          <label class="group-label">
            <span>Camera & Rendering Quality</span>
          </label>
          <div class="checkbox-row">
            <label v-for="mod in qualityModifiers" :key="mod.id" class="check-label">
              <input type="checkbox" v-model="mod.enabled" class="accent-indigo-500" />
              <span>{{ mod.label }}</span>
            </label>
          </div>
        </div>
      </UCard>

      <!-- Right Column: Live Prompt Output & Video Call Preview -->
      <section class="preview-panel">
        <!-- Assembled Prompt Box -->
        <UCard class="prompt-card">
          <div class="card-header">
            <h3>Assembled AI Prompt</h3>
            <div class="prompt-actions">
              <UButton
                size="xs"
                color="primary"
                variant="solid"
                icon="i-heroicons-clipboard-document"
                @click="copyPrompt"
              >
                {{ copied ? '✅ Copied!' : '📋 Copy Prompt' }}
              </UButton>
              <UButton
                size="xs"
                color="neutral"
                variant="outline"
                icon="i-heroicons-arrow-path"
                @click="resetForm"
              >
                🔄 Reset
              </UButton>
            </div>
          </div>
          <div class="prompt-box">
            <code>{{ generatedPrompt }}</code>
          </div>
          <div class="negative-prompt">
            <span class="neg-label">Negative Prompt:</span>
            <span class="neg-text">cluttered background, text, watermark, distorted, bad lighting, low resolution</span>
          </div>

          <!-- Generate Button -->
          <UButton
            block
            size="lg"
            color="primary"
            class="generate-btn font-bold"
            :loading="isGenerating"
            @click="generateImage"
          >
            <span v-if="!isGenerating">⚡ Generate Backsplash Preview</span>
            <span v-else>Rendering background with AI... {{ generationProgress }}%</span>
          </UButton>
        </UCard>

        <!-- Video Call Frame Preview -->
        <UCard class="preview-card">
          <div class="card-header">
            <h3>Video Call Live Preview</h3>
            <div class="blur-controls">
              <label for="blur-slider">Background Blur:</label>
              <input
                id="blur-slider"
                type="range"
                min="0"
                max="12"
                v-model="blurAmount"
                class="range-input accent-indigo-500"
              />
              <span>{{ blurAmount }}px</span>
            </div>
          </div>

          <div class="video-call-frame">
            <!-- Background Image Container -->
            <div
              class="bg-layer"
              :style="{
                backgroundImage: `url(${activeBackgroundImage})`,
                filter: `blur(${blurAmount}px)`
              }"
            ></div>

            <!-- Simulated Webcam User Silhouette Overlay -->
            <div class="webcam-overlay">
              <div class="avatar-silhouette">
                <div class="person-head"></div>
                <div class="person-shoulders"></div>
              </div>
            </div>

            <!-- Video Call UI Overlay Elements -->
            <div class="call-top-bar">
              <span class="room-title">Meeting: Project Review (16:9 4K)</span>
              <span class="rec-badge">● REC</span>
            </div>

            <div class="call-bottom-bar">
              <div class="user-tag">
                <span class="status-dot"></span> You (Presenter)
              </div>
              <div class="call-controls">
                <button class="call-icon-btn" title="Mic On">🎙️</button>
                <button class="call-icon-btn" title="Video On">📹</button>
                <button class="call-icon-btn active" title="Backsplash AI Active">✨</button>
                <button class="call-icon-btn danger" title="Leave">📞</button>
              </div>
            </div>

            <!-- Loading overlay during generation -->
            <div class="loading-overlay" v-if="isGenerating">
              <div class="loading-content">
                <div class="loader-spinner"></div>
                <p>Generating {{ currentMode }} Backsplash...</p>
                <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: `${generationProgress}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Download / Save Bar -->
          <div class="download-bar">
            <span class="active-preset-name">Current: {{ activePresetTitle }}</span>
            <UButton
              color="neutral"
              variant="solid"
              size="sm"
              icon="i-heroicons-arrow-down-tray"
              @click="downloadBackground"
            >
              Download Image
            </UButton>
          </div>
        </UCard>

        <!-- Sample Backsplash Presets Gallery -->
        <UCard class="gallery-card">
          <div class="card-header">
            <h3>Sample Backsplash Gallery</h3>
            <small class="text-slate-400">Click to apply preset image</small>
          </div>
          <div class="preset-grid">
            <div
              v-for="preset in samplePresets"
              :key="preset.id"
              class="preset-card"
              :class="{ active: activePresetId === preset.id }"
              @click="selectPreset(preset)"
            >
              <div class="preset-thumb" :style="{ backgroundImage: `url(${preset.imageUrl})` }">
                <UBadge size="xs" color="neutral" variant="solid" class="preset-tag">{{ preset.badge }}</UBadge>
              </div>
              <span class="preset-title">{{ preset.title }}</span>
            </div>
          </div>
        </UCard>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Mode definition
const modes = [
  { id: 'professional', label: 'Professional', emoji: '💼' },
  { id: 'whimsical', label: 'Whimsical', emoji: '🎨' },
  { id: 'custom', label: 'Custom', emoji: '⚙️' }
]

const currentMode = ref('professional')

// Categories by mode
const professionalCategories = [
  { id: 'exec-office', name: 'Executive Suite', icon: '🏢' },
  { id: 'bookshelf-nook', name: 'Modern Library', icon: '📚' },
  { id: 'loft-studio', name: 'Architectural Loft', icon: '🏗️' },
  { id: 'minimalist-desk', name: 'Minimalist Workspace', icon: '🖥️' }
]

const whimsicalCategories = [
  { id: 'cloud-castle', name: 'Cloud Castle', icon: '☁️' },
  { id: 'cyber-arcade', name: '80s Synth Lounge', icon: '🕹️' },
  { id: 'enchanted-jungle', name: 'Enchanted Botanical', icon: '🌿' },
  { id: 'cozy-fireplace', name: 'Floating Island Nook', icon: '🏝️' }
]

const customCategories = [
  ...professionalCategories,
  ...whimsicalCategories,
  { id: 'futuristic-lab', name: 'Sci-Fi Research Lab', icon: '🚀' }
]

const availableCategories = computed(() => {
  if (currentMode.value === 'professional') return professionalCategories
  if (currentMode.value === 'whimsical') return whimsicalCategories
  return customCategories
})

const selectedCategory = ref('exec-office')

// Scene description text
const sceneDescription = ref('Spacious corner office with floor-to-ceiling glass windows overlooking a sunlit metropolis')

// Decor tags
const decorTagsByMode = {
  professional: [
    'Potted Monstera Plant',
    'Wooden Bookcase',
    'Brass Desk Lamp',
    'Abstract Framed Art',
    'Acoustic Wood Paneling',
    'Sleek Glass Desk',
    'Soft Sheer Curtains'
  ],
  whimsical: [
    'Floating Glowing Crystals',
    'Neon Wave Light',
    'Pastel Cloud Canopy',
    'Retro Arcade Cabinet',
    'Bioluminescent Moss',
    'Whimsical Hanging Vines',
    'Starlight Projector'
  ],
  custom: [
    'Potted Monstera Plant',
    'Wooden Bookcase',
    'Neon Wave Light',
    'Floating Glowing Crystals',
    'Abstract Framed Art',
    'Brass Desk Lamp',
    'Bioluminescent Moss'
  ]
}

const availableDecorTags = computed(() => decorTagsByMode[currentMode.value] || decorTagsByMode.custom)
const selectedDecor = ref(['Potted Monstera Plant', 'Wooden Bookcase', 'Brass Desk Lamp'])

// Lighting Options
const lightingOptions = [
  { id: 'golden-hour', name: 'Golden Hour', desc: 'Warm ambient sunset glow through windows' },
  { id: 'soft-studio', name: 'Soft Studio Light', desc: 'Diffused professional key lighting' },
  { id: 'bright-natural', name: 'Crisp Natural Daylight', desc: 'Clean, energetic daylight' },
  { id: 'neon-cyber', name: 'Neon Atmosphere', desc: 'Vibrant blue & magenta backlighting' }
]
const selectedLighting = ref('golden-hour')

// Color Palettes
const colorPalettes = [
  { id: 'warm-timber', name: 'Warm Oak & Beige', colors: ['#d4a373', '#fefae0', '#e9edc9'] },
  { id: 'navy-gold', name: 'Executive Navy & Brass', colors: ['#1d3557', '#457b9d', '#e0a96d'] },
  { id: 'charcoal-monochrome', name: 'Charcoal & White', colors: ['#212529', '#495057', '#f8f9fa'] },
  { id: 'pastel-pop', name: 'Pastel Dreams', colors: ['#ffc6ff', '#bdb2ff', '#a0c4ff'] },
  { id: 'synth-cyber', name: 'Cyberpunk Teal & Pink', colors: ['#7209b7', '#f72585', '#4cc9f0'] }
]
const selectedPalette = ref('warm-timber')

// Quality Modifiers
const qualityModifiers = ref([
  { id: 'photorealistic', label: 'Photorealistic 8K render', enabled: true },
  { id: 'bokeh', label: 'Subtle DSLR depth-of-field bokeh', enabled: true },
  { id: 'clean-lighting', label: 'Balanced color grading for video calls', enabled: true },
  { id: 'architectural', label: 'Architectural Digest interior style', enabled: false }
])

// Mode switcher handler
function selectMode(modeId) {
  currentMode.value = modeId
  if (modeId === 'professional') {
    selectedCategory.value = 'exec-office'
    sceneDescription.value = 'Spacious corner office with floor-to-ceiling glass windows overlooking a sunlit metropolis'
    selectedLighting.value = 'golden-hour'
    selectedPalette.value = 'warm-timber'
    selectedDecor.value = ['Potted Monstera Plant', 'Wooden Bookcase', 'Brass Desk Lamp']
  } else if (modeId === 'whimsical') {
    selectedCategory.value = 'cloud-castle'
    sceneDescription.value = 'Dreamy pastel clouds floating outside a cozy glass turret balcony with enchanted stars'
    selectedLighting.value = 'neon-cyber'
    selectedPalette.value = 'pastel-pop'
    selectedDecor.value = ['Floating Glowing Crystals', 'Pastel Cloud Canopy', 'Starlight Projector']
  }
}

function toggleDecor(tag) {
  const idx = selectedDecor.value.indexOf(tag)
  if (idx > -1) {
    selectedDecor.value.splice(idx, 1)
  } else {
    selectedDecor.value.push(tag)
  }
}

// Compute assembled prompt
const generatedPrompt = computed(() => {
  const catObj = availableCategories.value.find(c => c.id === selectedCategory.value) || availableCategories.value[0]
  const lightObj = lightingOptions.find(l => l.id === selectedLighting.value)
  const paletteObj = colorPalettes.find(p => p.id === selectedPalette.value)

  let promptParts = []
  promptParts.push(`A professional video call background image, ${catObj ? catObj.name : ''}`)
  if (sceneDescription.value.trim()) {
    promptParts.push(sceneDescription.value.trim())
  }
  if (selectedDecor.value.length > 0) {
    promptParts.push(`featuring ${selectedDecor.value.join(', ')}`)
  }
  if (lightObj) {
    promptParts.push(`illuminated with ${lightObj.name.toLowerCase()} (${lightObj.desc})`)
  }
  if (paletteObj) {
    promptParts.push(`color scheme in ${paletteObj.name.toLowerCase()}`)
  }

  const activeMods = qualityModifiers.value.filter(m => m.enabled).map(m => m.label)
  if (activeMods.length > 0) {
    promptParts.push(activeMods.join(', '))
  }

  promptParts.push('16:9 widescreen format, high detail, no people in frame')

  return promptParts.join('. ')
})

// Copy prompt
const copied = ref(false)
function copyPrompt() {
  navigator.clipboard.writeText(generatedPrompt.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2500)
}

// Randomize / Surprise me
function randomizePrompt() {
  const randomCat = availableCategories.value[Math.floor(Math.random() * availableCategories.value.length)]
  selectedCategory.value = randomCat.id

  const randomLight = lightingOptions[Math.floor(Math.random() * lightingOptions.length)]
  selectedLighting.value = randomLight.id

  const randomPal = colorPalettes[Math.floor(Math.random() * colorPalettes.length)]
  selectedPalette.value = randomPal.id

  const shuffled = [...availableDecorTags.value].sort(() => 0.5 - Math.random())
  selectedDecor.value = shuffled.slice(0, Math.min(3, shuffled.length))

  if (currentMode.value === 'professional') {
    const descriptions = [
      'Modern executive studio with oak wall slats and city skyline view',
      'Cozy sunlit library with leather armchair and floor-to-ceiling books',
      'Minimalist Scandinavian workspace with soft ambient morning light'
    ]
    sceneDescription.value = descriptions[Math.floor(Math.random() * descriptions.length)]
  } else {
    const descriptions = [
      'Whimsical botanical garden lounge with glowing floating lanterns',
      'Retro 1980s neon synthwave office with vaporwave sunset horizon',
      'Cosmic observatory balcony overlooking a pastel nebulae galaxy'
    ]
    sceneDescription.value = descriptions[Math.floor(Math.random() * descriptions.length)]
  }
}

// Reset form
function resetForm() {
  selectMode(currentMode.value)
}

// Sample Gallery Presets
const samplePresets = [
  {
    id: 'preset-exec',
    title: 'Executive High-Rise Office',
    badge: 'Professional',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'preset-library',
    title: 'Cozy Warm Bookshelf',
    badge: 'Professional',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'preset-synth',
    title: 'Cyberpunk Neon Workstation',
    badge: 'Whimsical',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'preset-jungle',
    title: 'Enchanted Indoor Botanical',
    badge: 'Whimsical',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
  }
]

const activePresetId = ref('preset-exec')
const activeBackgroundImage = ref(samplePresets[0].imageUrl)
const activePresetTitle = ref(samplePresets[0].title)

function selectPreset(preset) {
  activePresetId.value = preset.id
  activeBackgroundImage.value = preset.imageUrl
  activePresetTitle.value = preset.title
}

// Background Blur
const blurAmount = ref(0)

// Simulated AI Image Generation
const isGenerating = ref(false)
const generationProgress = ref(0)

function generateImage() {
  if (isGenerating.value) return
  isGenerating.value = true
  generationProgress.value = 0

  const interval = setInterval(() => {
    generationProgress.value += 10
    if (generationProgress.value >= 100) {
      clearInterval(interval)
      isGenerating.value = false

      activePresetId.value = 'generated-custom'
      activePresetTitle.value = `AI Generated: ${sceneDescription.value.slice(0, 30)}...`

      if (currentMode.value === 'whimsical') {
        activeBackgroundImage.value = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
      } else {
        activeBackgroundImage.value = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
      }
    }
  }, 180)
}

function downloadBackground() {
  const link = document.createElement('a')
  link.href = activeBackgroundImage.value
  link.target = '_blank'
  link.download = `backsplash-ai-${currentMode.value}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.backsplash-app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text h1 {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tagline {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Mode Tabs */
.mode-tabs {
  display: flex;
  gap: 6px;
  background: #0f172a;
  padding: 6px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.mode-emoji {
  margin-right: 4px;
}

/* Main Grid Layout */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

/* Builder Panel */
.builder-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title h2 {
  font-size: 1.25rem;
  font-weight: 700;
}

/* Control Groups */
.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.group-label {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-weight: 600;
  font-size: 0.9rem;
  color: #e2e8f0;
}

.group-label small {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 400;
}

/* Category Pills */
.pill-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.pill-icon {
  margin-right: 6px;
}

/* Decor Tags */
.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Option Cards for Lighting */
.option-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.option-card {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: #0f172a;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.option-card:hover {
  border-color: #475569;
}

.option-card.active {
  background: rgba(99, 102, 241, 0.15);
  border-color: var(--primary);
}

.option-title {
  font-weight: 600;
  font-size: 0.85rem;
  color: white;
}

.option-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
}

/* Color Swatches */
.color-swatch-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.swatch-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: #0f172a;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.swatch-btn.active {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.15);
}

.swatch-colors {
  display: flex;
  height: 12px;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
}

.swatch-colors span {
  flex: 1;
}

.swatch-name {
  font-size: 0.72rem;
  color: var(--text-muted);
}

/* Checkboxes */
.checkbox-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.check-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
  cursor: pointer;
}

/* Preview Panel */
.preview-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
}

/* Prompt Card */
.prompt-box {
  background: #0f172a;
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  margin-bottom: 10px;
  max-height: 100px;
  overflow-y: auto;
}

.prompt-box code {
  font-family: monospace;
  font-size: 0.85rem;
  color: #38bdf8;
  line-height: 1.4;
}

.negative-prompt {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.neg-label {
  font-weight: 600;
  color: #f43f5e;
  margin-right: 6px;
}

.prompt-actions {
  display: flex;
  gap: 8px;
}

/* Video Call Frame Mockup */
.blur-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.range-input {
  width: 80px;
}

.video-call-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 2px solid var(--border-color);
  background: #000;
}

.bg-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: filter 0.2s ease, background-image 0.4s ease;
}

.webcam-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  pointer-events: none;
}

.avatar-silhouette {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0;
  opacity: 0.9;
}

.person-head {
  width: 120px;
  height: 140px;
  background: linear-gradient(180deg, #334155 0%, #1e293b 100%);
  border-radius: 60px 60px 50px 50px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  margin-bottom: -20px;
  z-index: 2;
}

.person-shoulders {
  width: 320px;
  height: 110px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  border-radius: 120px 120px 0 0;
  border: 2px solid rgba(255, 255, 255, 0.1);
  z-index: 1;
}

.call-top-bar {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  color: white;
}

.rec-badge {
  color: #f43f5e;
  font-weight: 700;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.call-bottom-bar {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-tag {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
}

.call-controls {
  display: flex;
  gap: 6px;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  padding: 4px 8px;
  border-radius: 20px;
}

.call-icon-btn {
  background: transparent;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  cursor: pointer;
}

.call-icon-btn.active {
  background: var(--primary);
}

.call-icon-btn.danger {
  background: #ef4444;
}

/* Loading Overlay inside frame */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: white;
  text-align: center;
  width: 80%;
}

.loader-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--primary-light);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.progress-bar-container {
  width: 100%;
  height: 6px;
  background: #334155;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #ec4899);
  transition: width 0.2s ease;
}

/* Download Bar */
.download-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.active-preset-name {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}

/* Gallery Grid */
.preset-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

@media (max-width: 640px) {
  .preset-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.preset-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
}

.preset-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-sm);
  background-size: cover;
  background-position: center;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.preset-card:hover .preset-thumb {
  transform: scale(1.02);
}

.preset-card.active .preset-thumb {
  border-color: var(--primary);
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.5);
}

.preset-tag {
  position: absolute;
  top: 4px;
  left: 4px;
}

.preset-title {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
