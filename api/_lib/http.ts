// Small helpers shared by the serverless functions. Files in api/_lib are not routes (underscore prefix).

export const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  })

/** Visitor IP as seen by Vercel (first entry of x-forwarded-for). */
export const clientIp = (request: Request) =>
  (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() ||
  request.headers.get('x-real-ip') ||
  'unknown'

/** Two-letter country code Vercel adds to every request (empty when running locally). */
export const clientCountry = (request: Request) => request.headers.get('x-vercel-ip-country') ?? ''

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** Reads a JSON or form-encoded body into a flat string map. */
export async function readFields(request: Request): Promise<Record<string, string> | null> {
  try {
    const type = request.headers.get('content-type') ?? ''
    if (type.includes('application/json')) {
      const data = (await request.json()) as Record<string, unknown>
      return Object.fromEntries(Object.entries(data ?? {}).map(([k, v]) => [k, v == null ? '' : String(v)]))
    }
    const form = await request.formData()
    return Object.fromEntries([...form.entries()].map(([k, v]) => [k, typeof v === 'string' ? v : '']))
  } catch {
    return null
  }
}

/**
 * In-memory fixed-window rate limiter.
 * Limitation: on serverless each warm instance has its own memory and it is wiped on cold starts,
 * so this slows down casual abuse but is not a hard global limit. For a strict limit use a shared
 * store (e.g. Upstash Redis or a Supabase table).
 */
export function rateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; reset: number }>()
  return (key: string) => {
    const now = Date.now()
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k)
    const entry = hits.get(key)
    if (!entry || entry.reset < now) {
      hits.set(key, { count: 1, reset: now + windowMs })
      return { ok: true, retryAfter: 0 }
    }
    entry.count++
    return { ok: entry.count <= max, retryAfter: Math.ceil((entry.reset - now) / 1000) }
  }
}
