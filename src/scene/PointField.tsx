import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, MathUtils, PerspectiveCamera, Vector2 } from 'three'
import { pointer, useScene } from '../state/scene'
import { buildField } from './path'
import { fragmentShader, vertexShader } from './shaders'

export function PointField({ count }: { count: number }) {
  const geometry = useMemo(() => buildField(count), [count])
  useEffect(() => () => geometry.dispose(), [geometry])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 1 },
      uPixelRatio: { value: 1 },
      uMotion: { value: 1 },
      uMouse: { value: new Vector2(9, 9) },
      uViewScale: { value: new Vector2(1, 1) },
    }),
    [],
  )
  const smoothMouse = useRef(new Vector2(9, 9))

  useFrame(({ camera, size, gl }, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const { reduced } = useScene.getState()
    const tanHalf = Math.tan(MathUtils.degToRad((camera as PerspectiveCamera).fov / 2))
    uniforms.uViewScale.value.set((tanHalf * size.width) / size.height, tanHalf)
    uniforms.uPixelRatio.value = gl.getPixelRatio()
    uniforms.uMotion.value = reduced ? 0 : 1
    if (!reduced) uniforms.uTime.value += dt

    if (pointer.active && !reduced) {
      const m = smoothMouse.current
      // First frame after re-entering: start from the cursor, don't sweep in from off-screen.
      if (m.x > 5) m.set(pointer.x, pointer.y)
      m.x = MathUtils.damp(m.x, pointer.x, 6, dt)
      m.y = MathUtils.damp(m.y, pointer.y, 6, dt)
      uniforms.uMouse.value.copy(m)
    } else {
      smoothMouse.current.set(9, 9)
      uniforms.uMouse.value.set(9, 9)
    }
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}
