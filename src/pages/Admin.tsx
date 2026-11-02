import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Check, Inbox, LogOut, Mail, RefreshCw, Trash2 } from 'lucide-react'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import s from './Admin.module.css'

interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  country: string | null
  is_read: boolean
  created_at: string
}

type View = 'loading' | 'login' | 'list' | 'disabled'

const when = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Cairo', dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(iso),
  )

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`/api/admin/${path}`, { credentials: 'same-origin', ...init })
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>
  return { status: res.status, body }
}

const sendJson = (method: string, data: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})

/** Private inbox for contact-form messages stored in Supabase. Not linked from the site. */
export default function Admin() {
  useDocumentTitle('Messages — Admin')
  const [view, setView] = useState<View>('loading')
  const [configured, setConfigured] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  // keep this page out of search engines
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.append(meta)
    return () => meta.remove()
  }, [])

  const load = useCallback(async () => {
    setError('')
    const { status, body } = await api('messages')
    if (status === 404) return setView('disabled')
    if (status === 401) return setView('login')
    if (status !== 200) {
      setError(String(body.error ?? 'Could not load messages.'))
      return setView('list')
    }
    setConfigured(body.configured !== false)
    setMessages((body.messages as Message[]) ?? [])
    setView('list')
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    void load()
  }, [load])

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const password = String(new FormData(e.currentTarget).get('password') ?? '')
    const { status, body } = await api('login', sendJson('POST', { password }))
    setBusy(false)
    if (status === 200) return load()
    if (status === 404) return setView('disabled')
    setError(String(body.error ?? 'Could not log in.'))
  }

  const logout = async () => {
    await api('logout', { method: 'POST' })
    setMessages([])
    setView('login')
  }

  const toggleRead = async (m: Message) => {
    setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, is_read: !m.is_read } : x)))
    const { status } = await api('messages', sendJson('PATCH', { id: m.id, is_read: !m.is_read }))
    if (status !== 200) {
      setError('Could not update the message. Refresh and try again.')
      void load()
    }
  }

  const remove = async (m: Message) => {
    if (!window.confirm(`Delete the message from ${m.name}? This cannot be undone.`)) return
    setMessages((list) => list.filter((x) => x.id !== m.id))
    const { status } = await api('messages', sendJson('DELETE', { id: m.id }))
    if (status !== 200) {
      setError('Could not delete the message. Refresh and try again.')
      void load()
    }
  }

  const unread = messages.filter((m) => !m.is_read).length
  const shown = filter === 'unread' ? messages.filter((m) => !m.is_read) : messages

  return (
    <main id="main" className={s.page}>
      <div className={`container ${s.wrap}`}>
        {view === 'loading' && <p className={s.muted}>Loading…</p>}

        {view === 'disabled' && (
          <div className={s.card}>
            <h1>Admin is not enabled</h1>
            <p className={s.muted}>
              This page is switched on from the Vercel project settings. See "How the contact form works" in the README.
            </p>
          </div>
        )}

        {view === 'login' && (
          <form className={`${s.card} ${s.login}`} onSubmit={login}>
            <h1>Messages</h1>
            <label htmlFor="admin-password">Password</label>
            <input id="admin-password" name="password" type="password" autoComplete="current-password" required autoFocus />
            {error && (
              <p className={s.error} role="alert">
                {error}
              </p>
            )}
            <button type="submit" className={s.primary} disabled={busy}>
              {busy ? 'Checking…' : 'Log in'}
            </button>
          </form>
        )}

        {view === 'list' && (
          <>
            <header className={s.head}>
              <div>
                <h1>Messages</h1>
                <p className={s.muted}>
                  {messages.length} total · {unread} unread
                </p>
              </div>
              <div className={s.tools}>
                <div className={s.tabs} role="group" aria-label="Filter">
                  {(['all', 'unread'] as const).map((f) => (
                    <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                      {f === 'all' ? 'All' : 'Unread'}
                    </button>
                  ))}
                </div>
                <button type="button" className={s.icon} onClick={() => void load()} aria-label="Refresh">
                  <RefreshCw size={18} />
                </button>
                <button type="button" className={s.icon} onClick={() => void logout()} aria-label="Log out">
                  <LogOut size={18} />
                </button>
              </div>
            </header>

            {error && (
              <p className={s.error} role="alert">
                {error}
              </p>
            )}
            {!configured && (
              <div className={s.card}>
                <p>
                  Messages are only being emailed. To also keep them here, connect Supabase (see the README).
                </p>
              </div>
            )}
            {configured && shown.length === 0 && (
              <div className={`${s.card} ${s.empty}`}>
                <Inbox size={28} aria-hidden="true" />
                <p>{filter === 'unread' ? 'No unread messages.' : 'No messages yet.'}</p>
              </div>
            )}

            <ul className={s.list}>
              {shown.map((m) => (
                <li key={m.id} className={`${s.card} ${s.msg} ${m.is_read ? '' : s.unread}`}>
                  <div className={s.msgHead}>
                    <div>
                      <strong>{m.name}</strong>
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || 'your message'}`)}`}>
                        {m.email}
                      </a>
                    </div>
                    <time dateTime={m.created_at}>{when(m.created_at)}</time>
                  </div>
                  {m.subject && <p className={s.subject}>{m.subject}</p>}
                  <p className={s.body}>{m.message}</p>
                  <div className={s.actions}>
                    <a
                      className={s.action}
                      href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || 'your message'}`)}`}
                    >
                      <Mail size={16} /> Reply
                    </a>
                    <button type="button" className={s.action} onClick={() => void toggleRead(m)}>
                      <Check size={16} /> {m.is_read ? 'Mark unread' : 'Mark read'}
                    </button>
                    <button type="button" className={`${s.action} ${s.danger}`} onClick={() => void remove(m)}>
                      <Trash2 size={16} /> Delete
                    </button>
                    {m.country && <span className={s.muted}>{m.country}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  )
}
