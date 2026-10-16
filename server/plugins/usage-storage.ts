import cloudflareKVBinding from 'unstorage/drivers/cloudflare-kv-binding'

// On Workers the daily counter must live in KV (the `USAGE` binding in wrangler.jsonc). Detect the binding at
// runtime instead of in the build config, so it works however the Worker was built (manual deploy or Cloudflare's
// Git auto-deploy). Everywhere else the `usage` mount from nuxt.config (files) stays in place.
export default defineNitroPlugin((nitroApp) => {
  // One-time, per-isolate setup (not request state); shared so concurrent first requests all wait for the swap.
  let ready: Promise<void> | undefined

  nitroApp.hooks.hook('request', async (event) => {
    const kv = (event.context.cloudflare?.env as { USAGE?: KVNamespace } | undefined)?.USAGE
    if (!kv) return

    ready ??= (async () => {
      const storage = useStorage()
      // Nitro already mounted the file driver at `usage`; unstorage won't mount over an existing mount point.
      await storage.unmount('usage')
      storage.mount('usage', cloudflareKVBinding({ binding: kv }))
    })()
    await ready
  })
})
