import type { H3Event } from 'h3'

const MODEL = '@cf/black-forest-labs/flux-1-schnell'
const STEPS = 8

interface WorkersAiBinding {
  run: (model: string, input: { prompt: string, steps: number }) => Promise<{ image?: string }>
}

export class FluxError extends Error {
  constructor(message: string, readonly kind: 'exhausted' | 'misconfigured' | 'failed') {
    super(message)
  }
}

// Cloudflare enforces its own free allowance; both the binding and REST API surface it as a quota-style error.
const isExhausted = (detail: string, status?: number) => status === 429 || /neuron|allocation|quota/i.test(detail)

/** Whether we're running as a Worker with the Workers AI binding attached. */
const aiBinding = (event: H3Event) =>
  (event.context.cloudflare?.env as { AI?: WorkersAiBinding } | undefined)?.AI

/**
 * Generates one image and returns it as base64 JPEG.
 * Uses the Workers AI binding when deployed on Cloudflare, and the REST API (account ID + token) everywhere else.
 */
export async function generateImage(event: H3Event, prompt: string): Promise<string> {
  const ai = aiBinding(event)
  if (ai) {
    try {
      const out = await ai.run(MODEL, { prompt, steps: STEPS })
      if (!out?.image) throw new FluxError('Workers AI returned no image.', 'failed')
      return out.image
    } catch (err) {
      if (err instanceof FluxError) throw err
      const detail = (err as Error)?.message ?? 'unknown error'
      throw new FluxError(detail, isExhausted(detail) ? 'exhausted' : 'failed')
    }
  }

  const { cloudflareAccountId, cloudflareApiToken } = useRuntimeConfig(event)
  if (!cloudflareAccountId || !cloudflareApiToken) {
    throw new FluxError(
      'Image generation is not configured. Set NUXT_CLOUDFLARE_ACCOUNT_ID and NUXT_CLOUDFLARE_API_TOKEN, or deploy with the AI binding.',
      'misconfigured'
    )
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
        body: JSON.stringify({ prompt, steps: STEPS })
      }
    )
  } catch {
    throw new FluxError('Could not reach Cloudflare. Try again.', 'failed')
  }

  const json = await res.json().catch(() => null) as
    | { image?: string, result?: { image?: string }, errors?: { message: string }[] }
    | null

  const image = json?.result?.image ?? json?.image
  if (!res.ok || !image) {
    const detail = json?.errors?.map(e => e.message).join('; ') || `HTTP ${res.status}`
    throw new FluxError(detail, isExhausted(detail, res.status) ? 'exhausted' : 'failed')
  }
  return image
}
