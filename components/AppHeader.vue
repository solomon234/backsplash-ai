<template>
  <header class="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-900/80 border-b border-slate-800 rounded-xl mb-6 backdrop-blur-md">
    <div class="flex items-center gap-3 mb-3 sm:mb-0">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
        <UIcon name="i-heroicons-sparkles" class="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 class="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Backsplash AI
        </h1>
        <p class="text-xs text-slate-400">Craft perfect AI backgrounds for video calls with Nuxt UI</p>
      </div>
    </div>

    <!-- Mode Toggle Tabs -->
    <div class="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
      <button
        type="button"
        @click="$emit('select-mode', 'professional')"
        :class="[
          'px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5',
          currentMode === 'professional' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
        ]"
      >
        <UIcon name="i-heroicons-briefcase" class="w-3.5 h-3.5" />
        Professional
      </button>
      <button
        type="button"
        @click="$emit('select-mode', 'whimsical')"
        :class="[
          'px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5',
          currentMode === 'whimsical' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
        ]"
      >
        <UIcon name="i-heroicons-paint-brush" class="w-3.5 h-3.5" />
        Whimsical
      </button>
      <button
        type="button"
        @click="$emit('select-mode', 'custom')"
        :class="[
          'px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5',
          currentMode === 'custom' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
        ]"
      >
        <UIcon name="i-heroicons-cog-6-tooth" class="w-3.5 h-3.5" />
        Custom
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { BacksplashMode } from '~/composables/useBacksplashPrompt'

defineProps<{
  currentMode: BacksplashMode
}>()

defineEmits<{
  (e: 'select-mode', mode: BacksplashMode): void
}>()
</script>
