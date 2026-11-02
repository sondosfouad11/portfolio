/**
 * One shared requestAnimationFrame loop for small per-frame jobs (marquee, scroll velocity),
 * so they do not need GSAP. The loop only runs while at least one job is subscribed.
 */
type Job = (deltaMs: number) => void

const jobs = new Set<Job>()
let raf = 0
let last = 0

const loop = (now: number) => {
  const delta = last ? now - last : 16
  last = now
  for (const job of jobs) job(delta)
  raf = jobs.size ? requestAnimationFrame(loop) : 0
}

export function onFrame(job: Job) {
  jobs.add(job)
  if (!raf) {
    last = 0
    raf = requestAnimationFrame(loop)
  }
  return () => {
    jobs.delete(job)
  }
}
