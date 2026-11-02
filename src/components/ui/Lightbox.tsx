import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { ImageAsset } from '../../lib/assets'
import { useFocusTrap } from '../../lib/useFocusTrap'
import s from './Lightbox.module.css'

interface Props {
  images: ImageAsset[]
  index: number | null
  alt: string
  onClose: () => void
  onChange: (i: number) => void
}

export function Lightbox({ images, index, alt, onClose, onChange }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  useFocusTrap(boxRef, index !== null)
  const open = index !== null

  useEffect(() => {
    if (!open) return
    // focus in/out is handled by useFocusTrap; this effect only locks scrolling and adds keys
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onChange((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open, index, images.length, onClose, onChange])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={boxRef}
          className={s.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} gallery`}
          onClick={onClose}
        >
          <button ref={closeRef} type="button" className={`${s.btn} ${s.close}`} onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                className={`${s.btn} ${s.prev}`}
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange((index - 1 + images.length) % images.length)
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                className={`${s.btn} ${s.next}`}
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange((index + 1) % images.length)
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <motion.img
            key={index}
            className={s.img}
            src={images[index].src}
            srcSet={images[index].srcset}
            sizes="100vw"
            alt={`${alt}, image ${index + 1} of ${images.length}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
