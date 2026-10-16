import type { H3Event } from 'h3'

export interface UsageSnapshot {
  used: number
  limit: number
  remaining: number
  /** ISO timestamp of the next 00:00 UTC, when Cloudflare's free allowance and this counter reset. */
  resetsAt: string
}

// Counters only matter for the current UTC day; let KV expire old ones.
const COUNTER_TTL_SECONDS = 2 * 24 * 60 * 60

const dayKey = () => `generations:${new Date().toISOString().slice(0, 10)}`

function nextResetIso() {
  const d = new Date()
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)).toISOString()
}

const limitOf = (event: H3Event) => Math.max(0, Number(useRuntimeConfig(event).dailyGenerationLimit) || 0)

// The counter is read-modify-write with no lock. Workers run many isolates, so an in-process lock can't make it exact
// (and module-level mutable state is unsafe across requests); under simultaneous requests it can overshoot slightly.
// For a strict cap, move the counter into a Durable Object.

const snapshot = (used: number, limit: number): UsageSnapshot => ({
  used,
  limit,
  remaining: Math.max(0, limit - used),
  resetsAt: nextResetIso()
})

export async function getUsage(event: H3Event): Promise<UsageSnapshot> {
  const used = (await useStorage('usage').getItem<number>(dayKey())) ?? 0
  return snapshot(used, limitOf(event))
}

/** Counts one generation against today's cap. Returns null if the cap is already reached. */
export async function reserveGeneration(event: H3Event): Promise<UsageSnapshot | null> {
  const storage = useStorage('usage')
  const limit = limitOf(event)
  const used = (await storage.getItem<number>(dayKey())) ?? 0
  if (used >= limit) return null
  await storage.setItem(dayKey(), used + 1, { ttl: COUNTER_TTL_SECONDS })
  return snapshot(used + 1, limit)
}

/** Gives a reservation back when the generation failed, so errors don't burn capacity. */
export async function releaseGeneration(): Promise<void> {
  const storage = useStorage('usage')
  const used = (await storage.getItem<number>(dayKey())) ?? 0
  await storage.setItem(dayKey(), Math.max(0, used - 1), { ttl: COUNTER_TTL_SECONDS })
}

/** Cloudflare says today's allowance is gone: pin the counter at the cap so the UI reflects it. */
export async function markExhausted(event: H3Event): Promise<void> {
  await useStorage('usage').setItem(dayKey(), limitOf(event), { ttl: COUNTER_TTL_SECONDS })
}
