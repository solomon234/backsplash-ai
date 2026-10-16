<template>
  <div class="space-y-6">
    <AppHeader
      :current-mode="currentMode"
      @select-mode="selectMode"
    />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column: Controls & Configuration -->
      <div class="lg:col-span-6 space-y-6">
        <PromptControls
          :current-mode="currentMode"
          :current-theme-list="currentThemeList"
          :selected-theme="selectedTheme"
          v-model:custom-scene="customScene"
          :available-decor="availableDecor"
          :selected-decor="selectedDecor"
          :lighting-options="lightingOptions"
          v-model:selected-lighting="selectedLighting"
          :color-palettes="colorPalettes"
          v-model:selected-palette="selectedPalette"
          :quality-modifiers="qualityModifiers"
          :selected-qualities="selectedQualities"
          v-model:raw-custom-prompt="rawCustomPrompt"
          @surprise-me="surpriseMe"
          @apply-theme="applyTheme"
          @toggle-decor="toggleDecor"
          @toggle-quality="toggleQuality"
        />
      </div>

      <!-- Right Column: Live Prompt & Video Preview -->
      <div class="lg:col-span-6 space-y-6">
        <PromptOutput
          :generated-prompt="generatedPrompt"
          :is-copied="isCopied"
          :is-generating="isGenerating"
          @copy-prompt="copyPrompt"
          @reset-defaults="resetToDefaults"
          @generate-background="generateBackground"
        />

        <VideoCallPreview
          v-model:background-blur="backgroundBlur"
          :active-background-url="activeBackgroundUrl"
          :is-generating="isGenerating"
          :generation-progress="generationProgress"
        />
      </div>
    </div>

    <!-- Gallery Presets Footer -->
    <PresetGallery
      :preset-gallery="presetGallery"
      @apply-preset="applyPreset"
    />
  </div>
</template>

<script setup lang="ts">
import { useBacksplashPrompt } from '~/composables/useBacksplashPrompt'

const {
  currentMode,
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
} = useBacksplashPrompt()
</script>
