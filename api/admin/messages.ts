// /api/admin/messages (session required)
//   GET                      → { ok, configured, messages }
//   PATCH  { id, is_read }   → mark read / unread
//   DELETE { id }            → delete
import { json, readFields } from '../_lib/http.js'
import { adminEnabled, isAuthed } from '../_lib/session.js'
import { deleteMessage, listMessages, setRead, supabaseEnabled } from '../_lib/supabase.js'

const guard = (request: Request) => {
  if (!adminEnabled()) return json(404, { ok: false, error: 'The admin page is not enabled.' })
  if (!isAuthed(request)) return json(401, { ok: false, error: 'Please log in.' })
  return null
}

const ID_RE = /^[0-9a-f-]{36}$/i

export async function GET(request: Request) {
  const blocked = guard(request)
  if (blocked) return blocked
  if (!supabaseEnabled()) return json(200, { ok: true, configured: false, messages: [] })
  try {
    return json(200, { ok: true, configured: true, messages: await listMessages() })
  } catch (err) {
    console.error('[admin] list failed:', err)
    return json(502, { ok: false, error: 'Could not load messages.' })
  }
}

export async function PATCH(request: Request) {
  const blocked = guard(request)
  if (blocked) return blocked
  const f = await readFields(request)
  if (!f || !ID_RE.test(f.id ?? '')) return json(400, { ok: false, error: 'Bad request.' })
  try {
    await setRead(f.id, f.is_read === 'true')
    return json(200, { ok: true })
  } catch (err) {
    console.error('[admin] update failed:', err)
    return json(502, { ok: false, error: 'Could not update the message.' })
  }
}

export async function DELETE(request: Request) {
  const blocked = guard(request)
  if (blocked) return blocked
  const f = await readFields(request)
  if (!f || !ID_RE.test(f.id ?? '')) return json(400, { ok: false, error: 'Bad request.' })
  try {
    await deleteMessage(f.id)
    return json(200, { ok: true })
  } catch (err) {
    console.error('[admin] delete failed:', err)
    return json(502, { ok: false, error: 'Could not delete the message.' })
  }
}
