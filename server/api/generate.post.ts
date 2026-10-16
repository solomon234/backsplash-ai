const MAX_PROMPT_LENGTH = 2048

export default defineEventHandler(async (event) => {
  const body = await readBody<{ prompt?: unknown }>(event)
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim().slice(0, MAX_PROMPT_LENGTH) : ''
  if (!prompt) {
    throw createError({ statusCode: 400, statusMessage: 'A non-empty prompt is required.' })
  }

  const reserved = await reserveGeneration(event)
  if (!reserved) {
    const usage = await getUsage(event)
    console.log(JSON.stringify({ message: 'daily generation limit reached', ...usage }))
    throw createError({
      statusCode: 429,
      statusMessage: 'Daily generation limit reached. It resets at 00:00 UTC.',
      data: usage
    })
  }

  try {
    const image = await generateImage(event, prompt)
    return { image: `data:image/jpeg;base64,${image}`, usage: reserved }
  } catch (err) {
    if (!(err instanceof FluxError)) {
      console.error(JSON.stringify({ message: 'generation failed unexpectedly', error: err instanceof Error ? err.message : String(err) }))
      await releaseGeneration()
      throw err
    }

    // Don't log the prompt: it's user-provided text and isn't needed to diagnose Cloudflare errors.
    console.error(JSON.stringify({ message: 'image generation failed', kind: err.kind, detail: err.message }))

    // Cloudflare's own allowance ran out: stop offering generations until it resets.
    if (err.kind === 'exhausted') {
      await markExhausted(event)
      throw createError({
        statusCode: 429,
        statusMessage: 'Cloudflare\'s free daily allowance is used up. It resets at 00:00 UTC.',
        data: await getUsage(event)
      })
    }

    await releaseGeneration()
    throw createError({
      statusCode: err.kind === 'misconfigured' ? 500 : 502,
      statusMessage: err.kind === 'misconfigured' ? err.message : `Cloudflare image generation failed: ${err.message}`
    })
  }
})
