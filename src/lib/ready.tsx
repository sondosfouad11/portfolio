import { createContext, useContext } from 'react'

/** False while the preloader is on screen, so the hero can wait before animating in. */
export const ReadyContext = createContext(true)
export const useReady = () => useContext(ReadyContext)
