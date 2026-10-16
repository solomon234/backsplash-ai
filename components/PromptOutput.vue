<template>
  <UCard class="bg-slate-900/60 border-slate-800">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 class="text-base font-semibold text-slate-100 flex items-center gap-2 whitespace-nowrap">
          Assembled AI Prompt
        </h2>
        <div class="flex items-center gap-2 [&_button]:whitespace-nowrap">
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
        :color="limitReached ? 'neutral' : 'primary'"
        :variant="limitReached ? 'subtle' : 'solid'"
        icon="i-heroicons-bolt"
        :loading="isGenerating"
        :disabled="limitReached"
        @click="$emit('generate-background')"
      >
        {{ limitReached ? 'Daily limit reached' : isGenerating ? 'Rendering Backsplash Preview...' : '⚡ Generate Backsplash Preview' }}
      </UButton>
      <p v-if="usage" class="mt-2 text-center text-[11px]" :class="limitReached ? 'text-amber-400' : 'text-slate-500'">
        <template v-if="limitReached">
          No generations left today. Resets at {{ resetTime }}.
          <template v-if="supportUrl">
            Keep it free for everyone:
            <a :href="supportUrl" target="_blank" rel="noopener noreferrer" class="underline font-medium hover:text-amber-300">buy me a coffee ☕</a>
          </template>
        </template>
        <template v-else>
          {{ usage.remaining }} of {{ usage.limit }} generations left today · resets at {{ resetTime }}
        </template>
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  generatedPrompt: string
  isCopied: boolean
  isGenerating: boolean
  usage: { used: number, limit: number, remaining: number, resetsAt: string } | null
  limitReached: boolean
}>()

const supportUrl = useRuntimeConfig().public.supportUrl

// Shown in the visitor's local time; the cap itself resets at 00:00 UTC.
const resetTime = computed(() =>
  props.usage
    ? new Date(props.usage.resetsAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : ''
)

defineEmits<{
  (e: 'copy-prompt'): void
  (e: 'reset-defaults'): void
  (e: 'generate-background'): void
}>()
</script>
