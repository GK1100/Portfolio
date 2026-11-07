import { heroStats, profile } from '../content/resume'
import { cssVars } from '../components/util'
import { Stat } from '../components/Stat'
import { scrollToSection } from '../lib/scroll'

const step = (i: number, rise = 12) => cssVars({ '--i': i, '--rise': `${rise}px` })

/**
 * Hero entrance, choreographed as one wave (one-shot, so 110ms steps are fine here):
 * eyebrow fades in place (decoration) → name rises furthest (lead) → lede, CTAs, stats follow with less travel.
 */
export function Hero() {
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToSection(id)
  }

  return (
    <section id="hero" className="section hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero__copy">
          <p className="eyebrow enter enter--fade" style={step(0)}>
            {profile.eyebrow}
          </p>
          <h1 id="hero-title" className="display enter" style={step(1, 20)}>
            {profile.firstName} <span className="grad">{profile.lastName}</span>
          </h1>
          <p className="lede enter" style={step(2, 12)}>
            {profile.lede}
          </p>
          <div className="cta-row enter" style={step(3, 10)}>
            <a className="btn btn--primary" href="#projects" onClick={go('projects')}>
              View projects
            </a>
            <a className="btn btn--ghost" href="#contact" onClick={go('contact')}>
              Get in touch
            </a>
          </div>
          <dl className="stats enter" style={step(4, 8)}>
            {heroStats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
