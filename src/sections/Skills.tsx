import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { skillEdges, skillGroups } from '../content/resume'
import { Reveal } from '../components/Reveal'

/** Edges are authored one-way; build the symmetric neighbour map once. */
const neighbours = (() => {
  const map = new Map<string, Set<string>>()
  const link = (a: string, b: string) => {
    if (!map.has(a)) map.set(a, new Set())
    map.get(a)!.add(b)
  }
  for (const [a, list] of Object.entries(skillEdges)) {
    for (const b of list) {
      link(a, b)
      link(b, a)
    }
  }
  return map
})()

export function Skills() {
  const [hover, setHover] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const active = hover ?? pinned

  const related = useMemo(() => (active ? neighbours.get(active) ?? new Set<string>() : null), [active])

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">02 — Skills</p>
          <h2 id="skills-title">Nearest neighbours.</h2>
          <p className="body body--narrow" aria-live="polite">
            {active ? (
              related && related.size > 0 ? (
                <>
                  <strong>{active}</strong> sits closest to {[...related].join(', ')}.
                </>
              ) : (
                <>
                  <strong>{active}</strong> stands on its own.
                </>
              )
            ) : (
              'Hover, focus or tap a skill to see what it connects to.'
            )}
          </p>
        </Reveal>

        <div className="skills">
          {skillGroups.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 80} className="skills__group glass">
              <h3 className="skills__title">{group.title}</h3>
              <ul className="chips">
                {group.items.map((item) => {
                  const isActive = active === item
                  const isRelated = related?.has(item) ?? false
                  return (
                    <li key={item}>
                      <button
                        type="button"
                        className={clsx('chip', isActive && 'is-active', isRelated && 'is-related', active && !isActive && !isRelated && 'is-dim')}
                        aria-pressed={pinned === item}
                        onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(item)}
                        onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(null)}
                        onFocus={() => setHover(item)}
                        onBlur={() => setHover(null)}
                        onClick={() => setPinned((p) => (p === item ? null : item))}
                      >
                        {item}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
