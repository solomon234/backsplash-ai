<template>
  <UCard class="bg-slate-900/60 border-slate-800">
    <template #header>
      <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Preset Backsplash Examples
      </h3>
    </template>
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <button
        v-for="preset in presetGallery"
        :key="preset.id"
        type="button"
        @click="$emit('apply-preset', preset)"
        class="group relative rounded-lg overflow-hidden border border-slate-800 hover:border-indigo-500 transition-all text-left bg-slate-950"
      >
        <img
          :src="preset.bgUrl"
          :alt="preset.title"
          class="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div class="p-1.5">
          <div class="text-[11px] font-medium text-slate-200 line-clamp-1">{{ preset.title }}</div>
          <UBadge
            :color="preset.category === 'professional' ? 'info' : 'secondary'"
            variant="subtle"
            size="xs"
            class="mt-1"
          >
            {{ preset.category }}
          </UBadge>
        </div>
      </button>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { PresetBackground } from '~/composables/useBacksplashPrompt'

defineProps<{
  presetGallery: PresetBackground[]
}>()

defineEmits<{
  (e: 'apply-preset', preset: PresetBackground): void
}>()
</script>
