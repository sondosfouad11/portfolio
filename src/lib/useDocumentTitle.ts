import { useEffect } from 'react'

const DEFAULT_TITLE = 'Sondos Lasheen — Full-Stack Developer & UI/UX Designer'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ?? DEFAULT_TITLE
    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [title])
}
