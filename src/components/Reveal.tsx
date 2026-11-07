import { useEffect, useRef, useState, type ReactNode } from 'react'
import clsx from 'clsx'
import { cssVars } from './util'

/**
 * One-shot scroll reveal. A plain CSS transition (interruptible, off the main thread)
 * toggled by an IntersectionObserver. Reduced motion → opacity only (see sections.css).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  /** Milliseconds. Keep steps to 60–120ms; this is a marketing page, not product UI. */
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={clsx('reveal', shown && 'is-in', className)} style={cssVars({ '--d': `${delay}ms` })}>
      {children}
    </div>
  )
}
