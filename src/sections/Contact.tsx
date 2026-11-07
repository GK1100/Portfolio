import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { profile } from '../content/resume'
import { Reveal } from '../components/Reveal'

export function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contact" className="section section--last" aria-labelledby="contact-title">
      <div className="container contact">
        <Reveal>
          <p className="eyebrow">05 — Contact</p>
          <h2 id="contact-title">
            Let's build something <span className="grad">that retrieves well.</span>
          </h2>
          <p className="body body--narrow">
            I'm looking for AI Engineer, GenAI and Applied AI roles. The fastest way to reach me is email.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="contact__actions">
            <a className="btn btn--primary btn--email" href={`mailto:${profile.email}`}>
              <span className="break">{profile.email}</span>
            </a>
            <button type="button" className={clsx('btn btn--ghost', copied && 'is-done')} onClick={copy}>
              <span role="status">{copied ? 'Copied' : 'Copy email'}</span>
            </button>
          </div>
          <ul className="links">
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.doi} target="_blank" rel="noreferrer">
                IEEE paper
              </a>
            </li>
          </ul>
        </Reveal>

        <p className="footer">© 2026 {profile.name}</p>
      </div>
    </section>
  )
}
