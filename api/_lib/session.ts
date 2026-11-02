// Admin session: a signed, httpOnly cookie. No database needed.
// Cookie value = "<expiry>.<HMAC-SHA256(expiry)>", signed with ADMIN_SESSION_SECRET
// (falls back to a key derived from ADMIN_PASSWORD so only one variable is required).
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE = 'sl_admin'
const MAX_AGE_S = 60 * 60 * 8 // 8 hours

const secret = () => {
  const s = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  return s ? createHash('sha256').update(`session:${s}`).digest() : null
}

const sign = (value: string, key: Buffer) => createHmac('sha256', key).update(value).digest('base64url')

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export const adminEnabled = () => Boolean(process.env.ADMIN_PASSWORD)

export function passwordMatches(input: string) {
  const real = process.env.ADMIN_PASSWORD
  if (!real) return false
  // compare hashes so the comparison time does not depend on the password length
  const h = (s: string) => createHash('sha256').update(s).digest('hex')
  return safeEqual(h(input), h(real))
}

const cookieAttrs = (request: Request) => {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return `Path=/api/admin; HttpOnly; SameSite=Strict${secure}`
}

export function sessionCookie(request: Request) {
  const key = secret()
  if (!key) throw new Error('ADMIN_PASSWORD is not set')
  const expiry = String(Math.floor(Date.now() / 1000) + MAX_AGE_S)
  return `${COOKIE}=${expiry}.${sign(expiry, key)}; Max-Age=${MAX_AGE_S}; ${cookieAttrs(request)}`
}

export const clearCookie = (request: Request) => `${COOKIE}=; Max-Age=0; ${cookieAttrs(request)}`

export function isAuthed(request: Request) {
  const key = secret()
  if (!key) return false
  const raw = (request.headers.get('cookie') ?? '')
    .split(';')
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1)
  if (!raw) return false
  const [expiry, sig] = raw.split('.')
  if (!expiry || !sig || !safeEqual(sig, sign(expiry, key))) return false
  return Number(expiry) > Date.now() / 1000
}
