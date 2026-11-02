import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import { profile } from '../../data/profile'
// Same rules as the server, so the visitor sees the same messages before and after sending.
import { cleanContact, LIMITS, validateContact, type FieldErrors } from '../../../api/_lib/validate'
import s from './Contact.module.css'

type Status = 'idle' | 'sending' | 'sent' | 'failed'

// Posts to our Vercel function unless VITE_FORM_ENDPOINT points somewhere else (e.g. Formspree).
const ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) || '/api/contact'
// Optional Cloudflare Turnstile (spam check). Off unless the site key is set.
const TURNSTILE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

const fields = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', inputMode: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', inputMode: 'email', required: true },
  { name: 'subject', label: 'Subject (optional)', type: 'text', autoComplete: 'off', inputMode: 'text', required: false },
] as const

export function ContactForm() {
  // when the visitor started (for the server's too-fast check); set after mount to keep render pure
  const openedAt = useRef(0)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [copied, setCopied] = useState(false)
  const [length, setLength] = useState(0)

  useEffect(() => {
    openedAt.current = Date.now()
  }, [])

  useEffect(() => {
    if (!TURNSTILE_KEY || document.getElementById('cf-turnstile-script')) return
    const script = document.createElement('script')
    script.id = 'cf-turnstile-script'
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    document.head.append(script)
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return // no double submit
    const form = e.currentTarget
    const data = new FormData(form)

    const clientErrors = validateContact(
      cleanContact(Object.fromEntries([...data.entries()].map(([k, v]) => [k, String(v)]))),
    )
    setErrors(clientErrors)
    setFormError('')
    if (Object.keys(clientErrors).length) {
      const first = Object.keys(clientErrors)[0]
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    data.set('_elapsed', String(Date.now() - openedAt.current))
    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: data })
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: FieldErrors }
      if (res.ok && body.ok !== false) {
        setStatus('sent')
        form.reset()
        setLength(0)
        openedAt.current = Date.now()
        return
      }
      if (res.status === 422 && body.fields) {
        setErrors(body.fields)
        setStatus('idle')
        return
      }
      // Rate limit, too fast, spam check: show the server's message, keep what they typed.
      if (res.status === 429 || res.status === 400) {
        setFormError(body.error ?? 'Please try again in a moment.')
        setStatus('idle')
        return
      }
      setStatus('failed')
    } catch {
      setStatus('failed')
    }
  }

  const errorId = (name: string) => `contact-${name}-error`

  return (
    <div className={s.formWrap}>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="sent"
            className={s.success}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className={s.successIcon}
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.1 }}
            >
              <Check size={28} strokeWidth={2.5} />
            </motion.span>
            <h3>Thank you, your message was sent.</h3>
            <p>I will reply to your email as soon as I can.</p>
            <button type="button" className={s.textBtn} onClick={() => setStatus('idle')}>
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className={s.form}
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-describedby="contact-form-status"
          >
            {fields.map((f) => (
              <div key={f.name} className={`${s.field} ${errors[f.name] ? s.invalid : ''}`}>
                <label htmlFor={`contact-${f.name}`}>{f.label}</label>
                <input
                  id={`contact-${f.name}`}
                  name={f.name}
                  type={f.type}
                  inputMode={f.inputMode}
                  autoComplete={f.autoComplete}
                  required={f.required}
                  maxLength={LIMITS[f.name]}
                  aria-invalid={errors[f.name] ? true : undefined}
                  aria-describedby={errors[f.name] ? errorId(f.name) : undefined}
                  onInput={() => errors[f.name] && setErrors((e) => ({ ...e, [f.name]: undefined }))}
                />
                {errors[f.name] && (
                  <p id={errorId(f.name)} className={s.fieldError}>
                    {errors[f.name]}
                  </p>
                )}
              </div>
            ))}

            <div className={`${s.field} ${errors.message ? s.invalid : ''}`}>
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                maxLength={LIMITS.message}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={`contact-message-count${errors.message ? ` ${errorId('message')}` : ''}`}
                onInput={(e) => {
                  setLength(e.currentTarget.value.length)
                  if (errors.message) setErrors((x) => ({ ...x, message: undefined }))
                }}
              />
              <div className={s.fieldFoot}>
                {errors.message ? (
                  <p id={errorId('message')} className={s.fieldError}>
                    {errors.message}
                  </p>
                ) : (
                  <span />
                )}
                <span id="contact-message-count" className={s.count}>
                  {length}/{LIMITS.message}
                </span>
              </div>
            </div>

            {/* Spam trap: hidden from people, bots fill it in */}
            <div className={s.trap} aria-hidden="true">
              <label htmlFor="contact-website">Leave this empty</label>
              <input id="contact-website" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            {TURNSTILE_KEY && <div className="cf-turnstile" data-sitekey={TURNSTILE_KEY} data-theme="auto" />}

            <button type="submit" className={s.send} disabled={status === 'sending'} aria-busy={status === 'sending'}>
              {status === 'sending' ? (
                <>
                  <span className={s.spinner} aria-hidden="true" /> Sending…
                </>
              ) : (
                'Send message'
              )}
            </button>

            <div id="contact-form-status" role="status" aria-live="polite">
              {formError && <p className={s.formError}>{formError}</p>}
              {status === 'failed' && (
                <div className={s.fallback}>
                  <p>
                    <strong>The message could not be sent right now.</strong> Nothing is lost: email me or send a
                    WhatsApp message instead.
                  </p>
                  <div className={s.fallbackRow}>
                    <a href={`mailto:${profile.email}`} className={s.fallbackLink}>
                      {profile.email}
                    </a>
                    <button type="button" className={s.copy} onClick={copyEmail}>
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className={s.copy}>
                      <FaWhatsapp size={16} /> WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
