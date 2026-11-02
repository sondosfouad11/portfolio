import { createContext, useContext } from 'react'

export interface ScrollApi {
  scrollTo: (target: string | number, opts?: { offset?: number; immediate?: boolean }) => void
}

/** Native scrolling, used before smooth scrolling starts or when reduced motion is on. */
export const nativeScrollTo: ScrollApi['scrollTo'] = (target) => {
  if (typeof target === 'number') window.scrollTo({ top: target })
  else document.querySelector(target)?.scrollIntoView()
}

export const ScrollContext = createContext<ScrollApi>({ scrollTo: nativeScrollTo })

export const useScroll = () => useContext(ScrollContext)
