import { lazy, Suspense, useEffect, useState } from 'react'
import clsx from 'clsx'
import { Nav } from './components/Nav'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'
import { hasWebGL } from './scene/webgl'
import { usePointerSync, useReducedMotionSync, useSceneSync, useSmoothScroll } from './hooks/useAppEffects'

// Three.js is the heavy part of the bundle. Load it after first paint so text is instant.
const Scene = lazy(() => import('./scene/Scene'))

export default function App() {
  useReducedMotionSync()
  useSmoothScroll()
  usePointerSync()
  useSceneSync()

  const [mountScene, setMountScene] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!hasWebGL()) return
    const t = window.setTimeout(() => setMountScene(true), 50)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <div className={clsx('scene', ready && 'is-ready')} aria-hidden="true">
        {mountScene && (
          <Suspense fallback={null}>
            <Scene onReady={() => setReady(true)} />
          </Suspense>
        )}
      </div>
      <div className="vignette" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
