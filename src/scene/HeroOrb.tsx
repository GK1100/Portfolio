import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AdditiveBlending, type Group, MathUtils } from 'three'
import { pointer, useScene } from '../state/scene'

/**
 * The hero's interactive object: nested wireframe icosahedra around a warm core.
 * It tilts toward the cursor, drifts slowly, and dissolves as you scroll away
 * (the camera would otherwise fly straight through it).
 */
export function HeroOrb() {
  const outer = useRef<Group>(null)
  const inner = useRef<Group>(null)
  const size = useThree((s) => s.size)
  // On portrait screens the copy sits over the orb, so it shrinks to stay a backdrop, not a competitor.
  const base = size.width / size.height < 1.15 ? 0.7 : 1

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const { progress, reduced } = useScene.getState()
    const o = outer.current
    const i = inner.current
    if (!o || !i) return

    const fade = 1 - MathUtils.smoothstep(progress, 0.3, 0.75)
    o.visible = fade > 0.01
    if (!o.visible) return
    o.scale.setScalar(MathUtils.lerp(0.001, base, fade))

    const follow = pointer.active && !reduced
    o.rotation.x = MathUtils.damp(o.rotation.x, follow ? -pointer.y * 0.35 : 0, 3, dt)
    o.rotation.y = MathUtils.damp(o.rotation.y, follow ? pointer.x * 0.45 : 0, 3, dt)

    if (!reduced) {
      i.rotation.y += dt * 0.15
      i.rotation.x += dt * 0.05
    }
  })

  return (
    <group ref={outer}>
      <group ref={inner}>
        <mesh>
          <icosahedronGeometry args={[2.3, 2]} />
          <meshBasicMaterial color="#8fb4ff" wireframe transparent opacity={0.28} depthWrite={false} blending={AdditiveBlending} />
        </mesh>
        <mesh scale={0.62}>
          <icosahedronGeometry args={[2.3, 1]} />
          <meshBasicMaterial color="#c4a2ff" wireframe transparent opacity={0.45} depthWrite={false} blending={AdditiveBlending} />
        </mesh>
      </group>
      <mesh>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshBasicMaterial color="#ffb08a" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}
