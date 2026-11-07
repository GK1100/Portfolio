import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { useScene } from '../state/scene'
import { CameraRig } from './CameraRig'
import { HeroOrb } from './HeroOrb'
import { PointField } from './PointField'
import { isLowPower } from './webgl'

export default function Scene({ onReady }: { onReady: () => void }) {
  const reduced = useScene((s) => s.reduced)
  const low = useMemo(() => isLowPower(), [])
  const maxDpr = low ? 1.25 : 1.75
  const [dpr, setDpr] = useState(Math.min(maxDpr, 1.5))

  return (
    <Canvas
      frameloop={reduced ? 'demand' : 'always'}
      dpr={dpr}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 55, near: 0.1, far: 200, position: [0, 0.3, 10] }}
      onCreated={onReady}
    >
      {/* Sheds resolution if the device can't hold frame rate, and recovers when it can. */}
      <PerformanceMonitor
        onChange={({ factor }) => setDpr(Math.round((1 + factor * (maxDpr - 1)) * 10) / 10)}
      />
      <PointField count={low ? 6000 : 14000} />
      <HeroOrb />
      <CameraRig />
    </Canvas>
  )
}
