// POST /api/admin/login  { password }  → sets the signed session cookie.
import { clientIp, json, rateLimiter, readFields } from '../_lib/http.js'
import { adminEnabled, passwordMatches, sessionCookie } from '../_lib/session.js'

const limit = rateLimiter(5, 15 * 60 * 1000) // 5 attempts per IP per 15 minutes (per warm instance)

export async function POST(request: Request) {
  if (!adminEnabled()) return json(404, { ok: false, error: 'The admin page is not enabled.' })

  const rate = limit(clientIp(request))
  if (!rate.ok) {
    return json(429, { ok: false, error: 'Too many attempts. Please wait and try again.' }, { 'Retry-After': String(rate.retryAfter) })
  }

  const fields = await readFields(request)
  if (!fields || !passwordMatches(fields.password ?? '')) {
    return json(401, { ok: false, error: 'Wrong password.' })
  }
  return json(200, { ok: true }, { 'Set-Cookie': sessionCookie(request) })
}
