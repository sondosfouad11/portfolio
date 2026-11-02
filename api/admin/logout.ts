// POST /api/admin/logout → clears the session cookie.
import { json } from '../_lib/http.js'
import { clearCookie } from '../_lib/session.js'

export const POST = (request: Request) => json(200, { ok: true }, { 'Set-Cookie': clearCookie(request) })
