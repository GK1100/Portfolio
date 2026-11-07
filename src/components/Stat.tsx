import { useEffect, useState } from 'react'
import NumberFlow from '@number-flow/react'
import type { Stat as StatData } from '../content/resume'

/** Counts up once, shortly after mount. NumberFlow itself honours prefers-reduced-motion. */
export function Stat({ value, suffix, label, delay = 700 }: StatData & { delay?: number }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const t = window.setTimeout(() => setShown(value), delay)
    return () => window.clearTimeout(t)
  }, [value, delay])

  return (
    <div className="stat">
      <dt className="stat__label">{label}</dt>
      <dd className="stat__value">
        <NumberFlow value={shown} suffix={suffix} />
      </dd>
    </div>
  )
}
