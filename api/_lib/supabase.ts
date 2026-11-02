// Optional storage of messages in Supabase (Phase 2). Talks to the Supabase REST API with fetch,
// using the service-role key, which only ever exists on the server.
// If SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing, everything here is a no-op.

export interface StoredMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  ip: string | null
  country: string | null
  is_read: boolean
  created_at: string
}

const config = () => {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return url && key ? { url, key } : null
}

export const supabaseEnabled = () => config() !== null

async function call(path: string, init: RequestInit = {}) {
  const c = config()
  if (!c) throw new Error('Supabase is not configured')
  const res = await fetch(`${c.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: c.key,
      Authorization: `Bearer ${c.key}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`)
  return res
}

export async function saveMessage(m: Omit<StoredMessage, 'id' | 'is_read' | 'created_at'>) {
  if (!supabaseEnabled()) return false
  await call('messages', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(m) })
  return true
}

export async function listMessages(): Promise<StoredMessage[]> {
  const res = await call('messages?select=*&order=created_at.desc&limit=500')
  return (await res.json()) as StoredMessage[]
}

export async function setRead(id: string, isRead: boolean) {
  await call(`messages?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ is_read: isRead }),
  })
}

export async function deleteMessage(id: string) {
  await call(`messages?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' })
}
