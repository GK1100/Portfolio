import { create } from 'zustand'

export const SECTION_IDS = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'] as const
export type SectionId = (typeof SECTION_IDS)[number]

interface SceneState {
  /** Float section index, 0 → 5. Read per-frame with getState(); don't subscribe to it. */
  progress: number
  /** Rounded section index. Safe to subscribe to — changes rarely. */
  active: number
  reduced: boolean
  setProgress: (p: number) => void
  setReduced: (r: boolean) => void
}

export const useScene = create<SceneState>((set) => ({
  progress: 0,
  active: 0,
  reduced: false,
  setProgress: (progress) =>
    set((s) => {
      const active = Math.round(progress)
      return { progress, active: active === s.active ? s.active : active }
    }),
  setReduced: (reduced) => set({ reduced }),
}))

/**
 * Pointer position in NDC. Deliberately a plain mutable object, not state:
 * it's written on every pointermove and read per-frame, and must never re-render React.
 */
export const pointer = { x: 0, y: 0, active: false }
