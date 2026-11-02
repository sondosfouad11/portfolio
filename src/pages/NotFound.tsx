import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page not found — Sondos Lasheen')
  return (
    <main
      id="main"
      className="container"
      style={{ minHeight: '80svh', display: 'grid', alignContent: 'center', gap: 20, paddingBlock: 120 }}
    >
      <p className="eyebrow">Error 404</p>
      <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 5rem)' }}>This page does not exist.</h1>
      <p style={{ color: 'var(--text-dim)', maxWidth: '46ch' }}>
        The link may be old or mistyped. Everything else is on the home page.
      </p>
      <p>
        <Link
          to="/"
          className="u-draw"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44, fontWeight: 600 }}
        >
          <ArrowLeft size={18} /> Back to the home page
        </Link>
      </p>
    </main>
  )
}
