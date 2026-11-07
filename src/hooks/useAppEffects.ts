import { useEffect } from 'react'
import Lenis from 'lenis'
import { pointer, SECTION_IDS, useScene } from '../state/scene'
import { setLenis } from '../lib/scroll'

/** Mirrors prefers-reduced-motion into the store so the canvas can react to it too. */
export function useReducedMotionSync() {
  const setReduced = useScene((s) => s.setReduced)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [setReduced])
}

/** Inertial scrolling. Skipped entirely when the visitor prefers reduced motion. */
export function useSmoothScroll() {
  const reduced = useScene((s) => s.reduced)
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, wheelMultiplier: 0.95 })
    setLenis(lenis)
    return () => {
      setLenis(null)
      lenis.destroy()
    }
  }, [reduced])
}

/** Fine-pointer position → NDC, for camera parallax, point attraction and orb tilt. */
export function usePointerSync() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !fine.matches) return
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
      pointer.active = true
    }
    const onLeave = () => {
      pointer.active = false
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])
}

/**
 * Maps scroll position to a float section index (0–5). Camera position is a pure
 * function of this number, so it stays locked to the DOM however tall sections are.
 */
export function useSceneSync() {
  const setProgress = useScene((s) => s.setProgress)
  useEffect(() => {
    let anchors: number[] = []
    let raf = 0

    const update = () => {
      if (anchors.length < 2) return
      const y = window.scrollY
      let i = 0
      while (i < anchors.length - 2 && y >= anchors[i + 1]) i++
      const a = anchors[i]
      const b = anchors[i + 1]
      const t = b > a ? Math.min(Math.max((y - a) / (b - a), 0), 1) : 0
      setProgress(i + t)
    }

    const measure = () => {
      const vh = window.innerHeight
      const max = Math.max(document.documentElement.scrollHeight - vh, 1)
      const raw = SECTION_IDS.map((id) => {
        const el = document.getElementById(id)
        if (!el) return 0
        const r = el.getBoundingClientRect()
        return r.top + window.scrollY + r.height / 2 - vh / 2
      })
      // First section anchors at the top, last at the bottom; keep strictly increasing.
      anchors = raw.map((a, i) => (i === 0 ? 0 : i === raw.length - 1 ? max : Math.min(Math.max(a, 0), max)))
      for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1)
      update()
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        update()
      })
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    void document.fonts?.ready.then(measure)
    return () => {
      window.removeEventListener('scroll', onScroll)
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [setProgress])
}

