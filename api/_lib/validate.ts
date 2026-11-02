// Contact form rules, shared by the server (api/contact.ts) and the form in the browser (ContactForm.tsx).

export const LIMITS = { name: 100, email: 255, subject: 200, message: 3000 }
export const MIN_MESSAGE = 10
export const MAX_LINKS = 3
/** A human needs at least this long between opening the page and sending. */
export const MIN_FILL_MS = 3000

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const LINK_RE = /(https?:\/\/|www\.)/gi

export interface ContactInput {
  name: string
  email: string
  subject: string
  message: string
}

export type FieldErrors = Partial<Record<keyof ContactInput, string>>

export function cleanContact(fields: Record<string, string>): ContactInput {
  const one = (v: string | undefined) => (v ?? '').replace(/\s+/g, ' ').trim()
  return {
    name: one(fields.name),
    email: one(fields.email).toLowerCase(),
    subject: one(fields.subject),
    // keep line breaks in the message, only trim the ends and collapse huge gaps
    message: (fields.message ?? '').replace(/\r\n/g, '\n').replace(/\n{4,}/g, '\n\n\n').trim(),
  }
}

export function validateContact(c: ContactInput): FieldErrors {
  const e: FieldErrors = {}
  if (!c.name) e.name = 'Please enter your name.'
  else if (c.name.length > LIMITS.name) e.name = `Please keep your name under ${LIMITS.name} characters.`

  if (!c.email) e.email = 'Please enter your email.'
  else if (c.email.length > LIMITS.email || !EMAIL_RE.test(c.email)) e.email = 'Please enter a valid email address.'

  if (c.subject.length > LIMITS.subject) e.subject = `Please keep the subject under ${LIMITS.subject} characters.`

  if (!c.message) e.message = 'Please write a message.'
  else if (c.message.length < MIN_MESSAGE) e.message = `Please write at least ${MIN_MESSAGE} characters.`
  else if (c.message.length > LIMITS.message) e.message = `Please keep your message under ${LIMITS.message} characters.`
  else if ((c.message.match(LINK_RE) ?? []).length > MAX_LINKS) e.message = `Please include no more than ${MAX_LINKS} links.`

  return e
}
