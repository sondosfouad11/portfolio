// Dev-only Vite plugin: serves the Vercel functions in /api from `npm run dev`, so the contact form
// and /admin work locally without the Vercel CLI. /api/foo/bar → api/foo/bar.ts, and the exported
// function named after the HTTP method (GET, POST, ...) handles the request, just like on Vercel.
import { existsSync } from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

export function vercelApiDev(): Plugin {
  return {
    name: 'vercel-api-dev',
    apply: 'serve',
    configureServer(server) {
      // Same as vercel.json in production: PDFs (the CV) are sent as downloads, so every browser saves the
      // real file instead of opening it (or saving nothing).
      server.middlewares.use((req, res, next) => {
        const file = (req.url ?? '').split('?')[0]
        if (file.toLowerCase().endsWith('.pdf')) {
          res.setHeader('Content-Disposition', `attachment; filename="${path.basename(file)}"`)
        }
        next()
      })

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        // Only real endpoints (/api/contact). Requests with a file extension (/api/_lib/validate.ts) are
        // source files the browser imports (the form shares its validation rules), so Vite serves those.
        if (!url.pathname.startsWith('/api/') || path.extname(url.pathname)) return next()

        const file = path.join(server.config.root, `${url.pathname.replace(/\/$/, '')}.ts`)
        const routeName = path.relative(path.join(server.config.root, 'api'), file)
        if (!existsSync(file) || routeName.split(path.sep).some((p) => p.startsWith('_'))) {
          res.statusCode = 404
          return res.end('Not found')
        }

        try {
          const mod = (await server.ssrLoadModule(file)) as Record<string, unknown>
          const handler = mod[req.method ?? 'GET']
          if (typeof handler !== 'function') {
            res.statusCode = 405
            return res.end('Method not allowed')
          }

          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const headers = new Headers()
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v)
          // mimic Vercel's proxy headers
          if (!headers.has('x-forwarded-for')) headers.set('x-forwarded-for', req.socket.remoteAddress ?? '127.0.0.1')

          const request = new Request(url, {
            method: req.method,
            headers,
            body: ['GET', 'HEAD'].includes(req.method ?? 'GET') ? undefined : Buffer.concat(chunks),
          })
          const response = (await handler(request)) as Response
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (err) {
          server.config.logger.error(`[api] ${url.pathname}: ${(err as Error).stack ?? err}`)
          res.statusCode = 500
          res.end(JSON.stringify({ ok: false, error: 'Server error' }))
        }
      })
    },
  }
}
