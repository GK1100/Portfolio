import type Lenis from 'lenis'
import { scrollEase } from '../motion/tokens'
import { useScene } from '../state/scene'

let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

/** Scroll to a section: inertial when Lenis is running, instant-ish native otherwise. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.2, easing: scrollEase })
  } else {
    el.scrollIntoView({ behavior: useScene.getState().reduced ? 'auto' : 'smooth', block: 'start' })
  }
}
