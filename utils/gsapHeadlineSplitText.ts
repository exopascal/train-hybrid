import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitType from "split-type"

type SplitTextOptions = {
  trigger?: Element
  start?: string
  toggleActions?: string
  y?: number
  duration?: number
  stagger?: number
  ease?: string
  onStart?: () => void
  onComplete?: () => void
}

export const createHeadlineSplitText = (
  headlineEl: HTMLElement | null,
  options: SplitTextOptions = {},
) => {
  if (!process.client || !headlineEl) {
    return () => {}
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {}
  }

  gsap.registerPlugin(ScrollTrigger)

  const split = new SplitType(headlineEl, { types: "chars" })
  const trigger = options.trigger ?? headlineEl

  const animation = gsap.from(split.chars, {
    opacity: 0,
    y: options.y ?? 24,
    duration: options.duration ?? 0.6,
    ease: options.ease ?? "power3.out",
    stagger: options.stagger ?? 0.02,
    onStart: options.onStart,
    onComplete: options.onComplete,
    scrollTrigger: {
      trigger,
      start: options.start ?? "top 80%",
      toggleActions: options.toggleActions ?? "play none none none",
    },
  })

  return () => {
    animation.scrollTrigger?.kill()
    animation.kill()
    split.revert()
  }
}
