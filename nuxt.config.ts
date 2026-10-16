// https://nuxt.com/docs/api/configuration/nuxt-config

// `npm run build:cloudflare` sets this; plain `npm run build` / dev stay on Node with file-based storage.
const onWorkers = process.env.NITRO_PRESET === 'cloudflare_module'
const fileUsageStorage = { driver: 'fs', base: './.data/usage' } as const

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  colorMode: { preference: 'dark', fallback: 'dark', storageKey: 'backsplash-color-mode' },
  runtimeConfig: {
    cloudflareAccountId: '',
    cloudflareApiToken: '',
    // Max image generations per UTC day. Cloudflare's free tier is 10,000 Neurons/day; tune this to your per-image cost.
    dailyGenerationLimit: 50,
    public: {
      // Buy Me a Coffee page; override with NUXT_PUBLIC_SUPPORT_URL. Leave empty to hide the support links.
      supportUrl: 'https://buymeacoffee.com/solomonmurf'
    }
  },
  nitro: {
    // Daily generation counter. KV on Workers (binding `USAGE` in wrangler.jsonc), plain files everywhere else.
    storage: {
      usage: onWorkers ? { driver: 'cloudflare-kv-binding', binding: 'USAGE' } : fileUsageStorage
    },
    devStorage: {
      usage: fileUsageStorage
    },
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  app: {
    head: {
      title: 'Backsplash AI - AI Background Generator for Video Calls',
      meta: [
        { name: 'description', content: 'Generate professional or whimsical AI backsplash background prompts and previews for video calls.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap' }
      ]
    }
  }
})
