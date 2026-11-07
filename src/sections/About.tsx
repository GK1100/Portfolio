import { about } from '../content/resume'
import { Reveal } from '../components/Reveal'

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container split">
        <div className="split__main">
          <Reveal>
            <p className="eyebrow">01 — About</p>
            <h2 id="about-title">{about.heading}</h2>
          </Reveal>
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={80 + i * 80}>
              <p className="body">{p}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160} className="split__aside">
          <dl className="facts glass">
            {about.facts.map((f) => (
              <div className="fact" key={f.label}>
                <dt className="fact__label">{f.label}</dt>
                <dd className="fact__value">
                  {'href' in f && f.href ? (
                    <a href={f.href} target="_blank" rel="noreferrer">
                      {f.value}
                    </a>
                  ) : (
                    f.value
                  )}
                  <span className="fact__detail">{f.detail}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
