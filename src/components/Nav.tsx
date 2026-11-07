import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { scrollToSection } from '../lib/scroll'
import { SECTION_IDS, useScene } from '../state/scene'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const

export function Nav() {
  const active = useScene((s) => SECTION_IDS[s.active])
  const list = useRef<HTMLUListElement>(null)

  // On phones the link row scrolls sideways; keep the active link in view.
  useEffect(() => {
    const ul = list.current
    const el = ul?.querySelector<HTMLElement>('.is-active')
    if (!ul || !el) return
    const left = el.offsetLeft - ul.clientWidth / 2 + el.clientWidth / 2
    ul.scrollTo({ left, behavior: useScene.getState().reduced ? 'auto' : 'smooth' })
  }, [active])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToSection(id)
  }

  return (
    <header className="nav">
      <nav className="nav__bar glass" aria-label="Primary">
        <a className="nav__brand" href="#hero" onClick={go('hero')} aria-label="Gaurav Kumavat — back to top">
          <span className="nav__mark" aria-hidden="true" />
          <span>GK</span>
        </a>
        <ul className="nav__links" ref={list}>
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={go(l.id)}
                className={clsx('nav__link', active === l.id && 'is-active')}
                aria-current={active === l.id ? 'true' : undefined}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
