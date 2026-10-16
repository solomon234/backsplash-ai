<template>
  <UCard class="bg-slate-900/60 border-slate-800">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-100 flex items-center gap-2">
          Backsplash Controls
          <UBadge color="neutral" variant="subtle" size="sm">
            <span v-if="currentMode === 'professional'">💼 Professional Mode</span>
            <span v-else-if="currentMode === 'whimsical'">🎨 Whimsical Mode</span>
            <span v-else>⚙️ Custom Prompt Mode</span>
          </UBadge>
        </h2>
        <UButton
          v-if="currentMode !== 'custom'"
          size="xs"
          color="neutral"
          variant="outline"
          icon="i-heroicons-sparkles"
          @click="$emit('surprise-me')"
        >
          Surprise Me
        </UButton>
      </div>
    </template>

    <div v-if="currentMode === 'custom'" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">
          Custom Direct AI Prompt
        </label>
        <UTextarea
          :model-value="rawCustomPrompt"
          @update:model-value="$emit('update:rawCustomPrompt', $event)"
          placeholder="Enter a full detailed prompt (e.g. Minimalist Scandinavian home office with monstera plant and soft morning sunlight)..."
          class="w-full bg-slate-950/80 border-slate-800 text-slate-200"
          :rows="4"
        />
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Theme Presets -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-400">Environment Theme</label>
          <span class="text-xs text-slate-500">Select background setting</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            v-for="theme in currentThemeList"
            :key="theme.id"
            type="button"
            @click="$emit('apply-theme', theme)"
            :class="[
              'p-2.5 rounded-lg border text-left transition-all flex items-start gap-2.5',
              selectedTheme === theme.id
                ? 'bg-indigo-950/50 border-indigo-500/80 text-white shadow-sm'
                : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            ]"
          >
            <UIcon :name="theme.icon" class="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <div class="text-xs font-medium text-slate-200">{{ theme.label }}</div>
              <div class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{{ theme.description }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Scene Description -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-400">Scene Description</label>
          <span class="text-xs text-slate-500">Core room features & architecture</span>
        </div>
        <UInput
          :model-value="customScene"
          @update:model-value="$emit('update:customScene', $event)"
          placeholder="Describe room details..."
          icon="i-heroicons-pencil-square"
          class="w-full bg-slate-950/80 border-slate-800 text-slate-200 text-xs"
        />
      </div>

      <!-- Decor Tags -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-400">Decor & Elements</label>
          <span class="text-xs text-slate-500">Select key items in view</span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="item in availableDecor"
            :key="item"
            type="button"
            @click="$emit('toggle-decor', item)"
            :class="[
              'px-2.5 py-1 rounded-md text-xs transition-all border flex items-center gap-1',
              selectedDecor.includes(item)
                ? 'bg-indigo-600/30 border-indigo-500/80 text-indigo-200 font-medium'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
            ]"
          >
            <UIcon v-if="selectedDecor.includes(item)" name="i-heroicons-check" class="w-3 h-3 text-indigo-400" />
            {{ item }}
          </button>
        </div>
      </div>

      <!-- Lighting & Vibe -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-400">Lighting & Vibe</label>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="light in lightingOptions"
            :key="light.id"
            type="button"
            @click="$emit('update:selectedLighting', light.id)"
            :class="[
              'p-2 rounded-lg border text-left transition-all',
              selectedLighting === light.id
                ? 'bg-indigo-950/50 border-indigo-500/80 text-white'
                : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
            ]"
          >
            <div class="text-xs font-medium text-slate-200">{{ light.label }}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">{{ light.desc }}</div>
          </button>
        </div>
      </div>

      <!-- Color Palette -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-400">Color Palette</label>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="palette in colorPalettes"
            :key="palette.id"
            type="button"
            @click="$emit('update:selectedPalette', palette.id)"
            :class="[
              'p-2 rounded-lg border transition-all flex flex-col items-center gap-1.5',
              selectedPalette === palette.id
                ? 'bg-indigo-950/50 border-indigo-500/80'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
            ]"
          >
            <div class="flex items-center gap-1">
              <span
                v-for="(color, idx) in palette.colors"
                :key="idx"
                class="w-3.5 h-3.5 rounded-full border border-slate-900 shadow-sm"
                :style="{ backgroundColor: color }"
              />
            </div>
            <span class="text-[11px] text-slate-300 font-medium text-center line-clamp-1">{{ palette.label }}</span>
          </button>
        </div>
      </div>

      <!-- Quality Modifiers -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-400">Rendering Modifiers</label>
        </div>
        <div class="space-y-1.5">
          <label
            v-for="qual in qualityModifiers"
            :key="qual.id"
            class="flex items-center gap-2 p-1.5 rounded-md hover:bg-slate-800/40 cursor-pointer text-xs text-slate-300"
          >
            <input
              type="checkbox"
              :checked="selectedQualities.includes(qual.id)"
              @change="$emit('toggle-quality', qual.id)"
              class="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/40"
            />
            <span>{{ qual.label }}</span>
          </label>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type {
  BacksplashMode,
  ThemeOption,
  OptionItem,
  PaletteItem,
  QualityModifier
} from '~/composables/useBacksplashPrompt'

defineProps<{
  currentMode: BacksplashMode
  currentThemeList: ThemeOption[]
  selectedTheme: string
  customScene: string
  availableDecor: string[]
  selectedDecor: string[]
  lightingOptions: OptionItem[]
  selectedLighting: string
  colorPalettes: PaletteItem[]
  selectedPalette: string
  qualityModifiers: QualityModifier[]
  selectedQualities: string[]
  rawCustomPrompt: string
}>()

defineEmits<{
  (e: 'surprise-me'): void
  (e: 'apply-theme', theme: ThemeOption): void
  (e: 'toggle-decor', decor: string): void
  (e: 'toggle-quality', qualId: string): void
  (e: 'update:customScene', value: string): void
  (e: 'update:rawCustomPrompt', value: string): void
  (e: 'update:selectedLighting', value: string): void
  (e: 'update:selectedPalette', value: string): void
}>()
</script>
