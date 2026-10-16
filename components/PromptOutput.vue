<template>
  <UCard class="bg-slate-900/60 border-slate-800">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-slate-100 flex items-center gap-2">
          Assembled AI Prompt
        </h2>
        <div class="flex items-center gap-2">
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            :icon="isCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
            @click="$emit('copy-prompt')"
          >
            {{ isCopied ? 'Copied!' : 'Copy Prompt' }}
          </UButton>
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-path"
            @click="$emit('reset-defaults')"
          >
            Reset
          </UButton>
        </div>
      </div>
    </template>

    <div class="p-3 bg-slate-950/90 rounded-lg border border-slate-800/80 font-mono text-xs text-indigo-300 leading-relaxed min-h-[90px] relative group">
      {{ generatedPrompt }}
    </div>

    <div class="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
      <span><strong class="text-slate-400">Negative Prompt:</strong> cluttered background, text, watermark, distorted, bad lighting, low resolution</span>
    </div>

    <div class="mt-4">
      <UButton
        block
        size="md"
        color="primary"
        icon="i-heroicons-bolt"
        :loading="isGenerating"
        @click="$emit('generate-background')"
      >
        {{ isGenerating ? 'Rendering Backsplash Preview...' : '⚡ Generate Backsplash Preview' }}
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  generatedPrompt: string
  isCopied: boolean
  isGenerating: boolean
}>()

defineEmits<{
  (e: 'copy-prompt'): void
  (e: 'reset-defaults'): void
  (e: 'generate-background'): void
}>()
</script>
