const MODEL = '@cf/black-forest-labs/flux-1-schnell'
const MAX_PROMPT_LENGTH = 2048

export default defineEventHandler(async (event) => {
  const { cloudflareAccountId, cloudflareApiToken } = useRuntimeConfig(event)
  if (!cloudflareAccountId || !cloudflareApiToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Image generation is not configured. Set NUXT_CLOUDFLARE_ACCOUNT_ID and NUXT_CLOUDFLARE_API_TOKEN.'
    })
  }

  const body = await readBody<{ prompt?: unknown }>(event)
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim().slice(0, MAX_PROMPT_LENGTH) : ''
  if (!prompt) {
    throw createError({ statusCode: 400, statusMessage: 'A non-empty prompt is required.' })
  }

  const reserved = await reserveGeneration(event)
  if (!reserved) {
    const usage = await getUsage(event)
    throw createError({
      statusCode: 429,
      statusMessage: 'Daily generation limit reached. It resets at 00:00 UTC.',
      data: usage
    })
  }

  let res: Response
  try {
    res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/ai/run/${MODEL}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cloudflareApiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, steps: 8 })
      }
    )
  } catch {
    await releaseGeneration()
    throw createError({ statusCode: 502, statusMessage: 'Could not reach Cloudflare. Try again.' })
  }

  const json = await res.json().catch(() => null) as
    | { image?: string, result?: { image?: string }, errors?: { message: string }[] }
    | null

  const image = json?.result?.image ?? json?.image
  if (!res.ok || !image) {
    const detail = json?.errors?.map(e => e.message).join('; ') || `HTTP ${res.status}`

    // Cloudflare enforces its own free allowance; when it runs out, stop offering generations until reset.
    if (res.status === 429 || /neuron|allocation|quota/i.test(detail)) {
      await markExhausted(event)
      throw createError({
        statusCode: 429,
        statusMessage: 'Cloudflare\'s free daily allowance is used up. It resets at 00:00 UTC.',
        data: await getUsage(event)
      })
    }

    await releaseGeneration()
    throw createError({ statusCode: 502, statusMessage: `Cloudflare image generation failed: ${detail}` })
  }

  return { image: `data:image/jpeg;base64,${image}`, usage: reserved }
})
