import { useRef, useState } from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll as useScrollProgress,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { profile } from '../../data/profile'
import { getImage } from '../../lib/assets'
import { useFinePointer } from '../../lib/hooks'
import { useReady } from '../../lib/ready'
import { useScroll } from '../../lib/scroll-context'
import { Button } from '../ui/Button'
import { Confetti } from '../ui/Confetti'
import s from './Hero.module.css'

/** Splits text into letters so each one can react when the pointer passes over it. */
function Letters({ text }: { text: string }) {
  // Each word stays in one piece (nowrap) so a long word never breaks in the middle.
  return (
    <>
      {text.split(' ').map((word, w) => (
        <span key={w}>
          {w > 0 && ' '}
          <span className={s.word} aria-hidden="true">
            {word.split('').map((ch, i) => (
              <span key={i} className={s.char}>
                {ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </>
  )
}

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const ready = useReady()
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const { scrollTo } = useScroll()
  const portrait = getImage('profile', 'portrait')
  const [burst, setBurst] = useState(0)

  // Mouse position from -0.5 to 0.5, smoothed. Drives a gentle parallax on the lines and the photo.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 80, damping: 20 })
  const sy = useSpring(my, { stiffness: 80, damping: 20 })
  const lineA = useTransform(sx, (v) => v * -24)
  const lineB = useTransform(sx, (v) => v * 24)
  const photoX = useTransform(sx, (v) => v * 14)
  const photoY = useTransform(sy, (v) => v * 10)
  // Floating shapes sit at different depths: the further "back", the less they follow the mouse.
  const nearX = useTransform(sx, (v) => v * 70)
  const nearY = useTransform(sy, (v) => v * 50)
  const farX = useTransform(sx, (v) => v * -35)
  const farY = useTransform(sy, (v) => v * -25)

  // Scroll: the headline drifts up and softens, the photo lags behind, shapes rise faster.
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScrollProgress({ target: heroRef, offset: ['start start', 'end start'] })
  const titleScrollY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80])
  const titleFade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.35])
  const photoScrollY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90])
  const shapesScrollY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -160])
  // Pause the looping CSS animations (glows, stamp, shapes) while the hero is off screen.
  const onScreen = useInView(heroRef, { margin: '0px 0px -10% 0px' })

  const onMove = (e: React.PointerEvent) => {
    if (!fine || reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  // Headline lines slide up out of a mask, one after another.
  const lineRise = (delay: number) => ({
    initial: { y: reduce ? 0 : '110%', opacity: reduce ? 0 : 1 },
    animate: ready ? { y: '0%', opacity: 1 } : { y: reduce ? 0 : '110%', opacity: reduce ? 0 : 1 },
    transition: { duration: 1, delay, ease },
  })

  // Same slide as rise() but WITHOUT fading: the portrait is the largest element on screen, and it must be
  // painted (even while the intro curtain still covers it) instead of waiting for an opacity animation.
  const slide = (delay: number) => ({
    initial: { y: reduce ? 0 : 40 },
    animate: ready ? { y: 0 } : { y: reduce ? 0 : 40 },
    transition: { duration: 0.9, delay, ease },
  })

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 40 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 40 },
    transition: { duration: 0.9, delay, ease },
  })

  return (
    <section
      ref={heroRef}
      className={s.hero}
      id="top"
      onPointerMove={onMove}
      aria-labelledby="hero-title"
      data-paused={onScreen ? undefined : ''}
    >
      <motion.div className={s.shapes} style={{ y: shapesScrollY }} aria-hidden="true">
        <motion.span className={s.shapeStar} style={{ x: nearX, y: nearY }}>
          <svg viewBox="0 0 100 100"><path d="M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42Z" /></svg>
        </motion.span>
        <motion.span className={s.shapeRing} style={{ x: farX, y: farY }} />
        <motion.span className={s.shapePill} style={{ x: nearX, y: farY }} />
        <motion.span className={s.shapeDot} style={{ x: farX, y: nearY }} />
      </motion.div>

      <div className={`container ${s.inner}`}>
        <motion.p className={s.status} {...rise(0.05)}>
          <i aria-hidden="true" /> {profile.availability}
        </motion.p>

        <motion.h1
          id="hero-title"
          className={s.title}
          aria-label="I build and design digital experiences"
          style={{ y: titleScrollY, opacity: titleFade }}
        >
          <motion.span className={`${s.line} ${s.masked}`} style={{ x: lineA }}>
            <motion.span className={s.lineIn} {...lineRise(0.1)}>
              <Letters text="I BUILD &" />
            </motion.span>
          </motion.span>
          <motion.span className={s.line} style={{ x: lineB }}>
            <motion.span className={`${s.lineIn} ${s.designLine}`} {...rise(0.18)}>
              <span className="serif">design</span>
              {/* hand-drawn underline that draws itself in */}
              <svg className={s.scribble} viewBox="0 0 300 30" aria-hidden="true" preserveAspectRatio="none">
                <motion.path
                  d="M4 20 C 60 6, 120 26, 180 14 S 270 8, 296 18"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: ready ? 1 : 0 }}
                  transition={{ duration: 1.1, delay: 0.7, ease }}
                />
              </svg>
            </motion.span>
          </motion.span>
          <motion.span className={`${s.line} ${s.masked}`} style={{ x: lineA }}>
            <motion.span className={s.lineIn} {...lineRise(0.3)}>
              <Letters text="DIGITAL" />
            </motion.span>
          </motion.span>
          <motion.span className={`${s.line} ${s.masked}`} style={{ x: lineB }}>
            <motion.span className={s.lineIn} {...lineRise(0.4)}>
              <Letters text="EXPERIENCES" />
            </motion.span>
          </motion.span>
        </motion.h1>

        <motion.div className={s.photoCol} style={{ x: photoX, y: photoY }} {...slide(0.2)}>
          <motion.div className={s.photoFrame} style={{ y: photoScrollY }}>
            <span className={s.block} aria-hidden="true" />
            <button
              type="button"
              className={s.photo}
              onClick={() => setBurst((n) => n + 1)}
              aria-label="Celebrate"
              data-cursor="Pop"
            >
              {portrait ? (
                <img
                  src={portrait.src}
                  srcSet={portrait.srcset}
                  sizes="(max-width: 860px) 62vw, 360px"
                  width={portrait.width}
                  height={portrait.height}
                  alt="Portrait of Sondos Lasheen"
                  fetchPriority="high"
                />
              ) : (
                <span className={s.noPhoto}>SL</span> /* TODO: replace with real photo */
              )}
            </button>
            {burst > 0 && <Confetti key={burst} />}

            <div className={s.stamp} aria-hidden="true">
              <svg viewBox="0 0 200 200">
                <defs>
                  <path id="stamp-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
                </defs>
                <text>
                  <textPath href="#stamp-circle" textLength="462" lengthAdjust="spacing">
                    FULL-STACK • UI/UX • BRAND • FULL-STACK • UI/UX • BRAND •
                  </textPath>
                </text>
              </svg>
              <span>SL</span>
            </div>
          </motion.div>
          <p className={s.caption}>
            {profile.name} — {profile.location}
          </p>
        </motion.div>

        <motion.div className={s.bottom} {...rise(0.42)}>
          <p className={s.intro}>{profile.intro}</p>
          <div className={s.ctas}>
            {/* Kept still on purpose (no magnetic pull): only a soft hover colour and arrow nudge */}
            <Button onClick={() => scrollTo('#work')} cursor="Go" magnetic={false}>
              View work
            </Button>
            {/* A plain same-site link with `download`: the browser fetches the real file from the server.
                (A JavaScript blob download saved an empty file in some browsers.) */}
            <Button href={profile.cv} variant="ghost" download cursor="CV" magnetic={false}>
              Download CV
            </Button>
          </div>
        </motion.div>

        <button type="button" className={s.cue} onClick={() => scrollTo('#work')} aria-label="Scroll to work">
          <ArrowDown size={18} />
        </button>
      </div>
    </section>
  )
}
