import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import { pointer, useScene } from '../state/scene'
import { camCurve, lookCurve } from './path'

const LAST = 5

/**
 * The camera is a pure function of scroll progress (+ a little damped cursor parallax).
 * Under reduced motion it snaps between sections instead of travelling, and the
 * canvas renders on demand rather than every frame.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera)
  const invalidate = useThree((s) => s.invalidate)
  const state = useRef({ s: 0, mx: 0, my: 0 })
  const pos = useMemo(() => new Vector3(), [])
  const look = useMemo(() => new Vector3(), [])

  useEffect(
    () =>
      useScene.subscribe((next, prev) => {
        if (Math.round(next.progress) !== Math.round(prev.progress) || next.reduced !== prev.reduced) invalidate()
      }),
    [invalidate],
  )

  useFrame(({ size }, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const { progress, reduced } = useScene.getState()
    const st = state.current

    st.s = reduced ? Math.round(progress) : MathUtils.damp(st.s, progress, 5, dt)
    const t = MathUtils.clamp(st.s / LAST, 0, 1)
    camCurve.getPoint(t, pos)
    lookCurve.getPoint(t, look)

    // On wide screens, push the subject to the right half so copy sits on the left.
    if (size.width / size.height > 1.15) look.x -= 3.2

    if (pointer.active && !reduced) {
      st.mx = MathUtils.damp(st.mx, pointer.x, 3, dt)
      st.my = MathUtils.damp(st.my, pointer.y, 3, dt)
    } else {
      st.mx = MathUtils.damp(st.mx, 0, 3, dt)
      st.my = MathUtils.damp(st.my, 0, 3, dt)
    }
    pos.x += st.mx * 0.55
    pos.y += st.my * 0.35

    camera.position.copy(pos)
    camera.lookAt(look)
  })

  return null
}
