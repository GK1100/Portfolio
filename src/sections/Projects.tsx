import { useId, useMemo, useState } from 'react'
import { projects, type Project } from '../content/resume'
import { Reveal } from '../components/Reveal'
import { TiltCard } from '../components/TiltCard'

/** Lowercase, strip diacritics, split on anything that isn't a letter, digit, "+" or "-" (Unicode-aware). */
const tokenize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .split(/[^\p{L}\p{N}+-]+/u)
    .filter(Boolean)

/**
 * Plain client-side relevance ranking — no model involved. Each query token must
 * prefix-match a word in the project's text; score = tokens matched.
 */
function rank(query: string): { project: Project; score: number }[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return projects.map((project) => ({ project, score: 0 }))
  return projects
    .map((project) => {
      const words = tokenize(
        `${project.title} ${project.kicker} ${project.summary} ${project.stack.join(' ')} ${project.keywords}`,
      )
      const score = tokens.filter((t) => words.some((w) => w.startsWith(t))).length
      return { project, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
}

export function Projects() {
  const [query, setQuery] = useState('')
  const inputId = useId()
  const results = useMemo(() => rank(query), [query])
  const searching = query.trim().length > 0

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">03 — Projects</p>
          <h2 id="projects-title">Selected work.</h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="search glass">
            <label className="search__label" htmlFor={inputId}>
              Search my work
            </label>
            <input
              id={inputId}
              className="search__input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="try “vector”, “x-ray” or “latency”"
              autoComplete="off"
              spellCheck={false}
            />
            <p className="search__count" role="status">
              {searching ? `${results.length} of ${projects.length} match` : `${projects.length} projects`}
            </p>
          </div>
        </Reveal>

        {results.length === 0 ? (
          <div className="empty glass">
            <p>
              Nothing matches <strong className="break">“{query.trim()}”</strong>. Try “rag”, “audio” or “video”.
            </p>
            <button type="button" className="btn btn--ghost" onClick={() => setQuery('')}>
              Clear search
            </button>
          </div>
        ) : (
          <ul className="cards">
            {results.map(({ project: p }, i) => (
              <li key={p.id}>
                <Reveal delay={Math.min(i, 3) * 70}>
                  <TiltCard className="card glass">
                    <p className="card__kicker">{p.kicker}</p>
                    <h3 className="card__title">{p.title}</h3>
                    <p className="card__summary">{p.summary}</p>
                    <ul className="card__points">
                      {p.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                    {p.metric && (
                      <p className="card__metric">
                        <span className="card__metric-value">{p.metric.value}</span>
                        <span className="card__metric-label">{p.metric.label}</span>
                      </p>
                    )}
                    <ul className="tags">
                      {p.stack.map((s) => (
                        <li key={s} className="tag">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </TiltCard>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
