// POST /api/contact — Vercel serverless function.
// Validates the message, blocks spam, emails it to Sondos through Resend, and (optionally) stores it in Supabase.
//
// Environment variables (Vercel → Project → Settings → Environment Variables; never in the frontend):
//   RESEND_API_KEY        required to send email
//   CONTACT_TO_EMAIL      inbox that receives messages (default sondoslasheen@gmail.com)
//   CONTACT_FROM_EMAIL    sender (default "Portfolio <onboarding@resend.dev>")
//   TURNSTILE_SECRET_KEY  optional: turns on the Cloudflare Turnstile check
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  optional: also save messages for the /admin page
//   CONTACT_DRY_RUN=true  local testing only: skip sending and report success
import { clientCountry, clientIp, escapeHtml, json, rateLimiter, readFields } from './_lib/http.js'
import { cleanContact, MIN_FILL_MS, validateContact, type ContactInput } from './_lib/validate.js'
import { saveMessage } from './_lib/supabase.js'

const limit = rateLimiter(5, 60 * 60 * 1000) // 5 messages per IP per hour (per warm instance)

const cairoTime = (d: Date) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Cairo',
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(d)

async function turnstileOk(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // optional feature, off by default
  if (!token) return false
  const body = new URLSearchParams({ secret, response: token, remoteip: ip })
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
  const data = (await res.json().catch(() => ({}))) as { success?: boolean }
  return data.success === true
}

function emailBodies(c: ContactInput, meta: { time: string; ip: string; country: string }) {
  const rows: [string, string][] = [
    ['Name', c.name],
    ['Email', c.email],
    ['Subject', c.subject || '—'],
    ['Time (Cairo)', meta.time],
    ['From', [meta.country, meta.ip].filter(Boolean).join(' · ') || '—'],
  ]
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${c.message}\n\n— Reply to this email to answer ${c.name}.`
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;max-width:600px">
  <h2 style="margin:0 0 16px;font-size:20px">New message from your portfolio</h2>
  <table style="border-collapse:collapse;margin-bottom:20px">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`,
    )
    .join('')}</table>
  <div style="padding:16px;border-left:3px solid #8f1d22;background:#f6f4f4;white-space:pre-wrap">${escapeHtml(c.message)}</div>
  <p style="color:#666;font-size:13px;margin-top:20px">Reply to this email to answer ${escapeHtml(c.name)} directly.</p>
</div>`
  return { text, html }
}

export async function POST(request: Request) {
  const ip = clientIp(request)
  const fields = await readFields(request)
  if (!fields) return json(400, { ok: false, error: 'The request could not be read.' })

  // Spam trap: real people never see or fill this field. Pretend it worked so bots learn nothing.
  if (fields._gotcha) return json(200, { ok: true })

  // Sent too fast after the page opened: almost certainly a bot.
  const elapsed = Number(fields._elapsed)
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return json(400, { ok: false, error: 'That was very fast. Please wait a moment and send again.' })
  }

  const rate = limit(ip)
  if (!rate.ok) {
    return json(
      429,
      { ok: false, error: 'Too many messages from your network. Please try again later or email me directly.' },
      { 'Retry-After': String(rate.retryAfter) },
    )
  }

  const contact = cleanContact(fields)
  const errors = validateContact(contact)
  if (Object.keys(errors).length) return json(422, { ok: false, error: 'Please check the highlighted fields.', fields: errors })

  if (!(await turnstileOk(fields['cf-turnstile-response'] ?? '', ip))) {
    return json(400, { ok: false, error: 'The spam check failed. Please refresh the page and try again.' })
  }

  const country = clientCountry(request)
  const now = new Date()

  // Save first (if enabled) so the message is kept even if email fails. A storage error never blocks sending.
  let stored = false
  try {
    stored = await saveMessage({ ...contact, subject: contact.subject || null, ip, country: country || null })
  } catch (err) {
    console.error('[contact] Supabase save failed:', err)
  }

  if (process.env.CONTACT_DRY_RUN === 'true') {
    console.log('[contact] dry run, not sending:', contact.email, contact.subject)
    return json(200, { ok: true, dryRun: true })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set')
    // If the message was stored, the owner still gets it in /admin.
    return stored ? json(200, { ok: true }) : json(503, { ok: false, error: 'The form is not set up yet.' })
  }

  const { text, html } = emailBodies(contact, { time: cairoTime(now), ip, country })
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO_EMAIL || 'sondoslasheen@gmail.com'],
      reply_to: contact.email,
      subject: `New portfolio message from ${contact.name}`,
      text,
      html,
    }),
  }).catch((err: unknown) => {
    console.error('[contact] Resend request failed:', err)
    return null
  })

  if (!res || !res.ok) {
    if (res) console.error('[contact] Resend error', res.status, await res.text())
    return stored ? json(200, { ok: true }) : json(502, { ok: false, error: 'The message could not be sent right now.' })
  }
  return json(200, { ok: true })
}

// Anything other than POST
export const GET = () => json(405, { ok: false, error: 'Method not allowed' }, { Allow: 'POST' })
