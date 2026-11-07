import { jobs } from '../content/resume'
import { Reveal } from '../components/Reveal'

export function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">04 — Experience</p>
          <h2 id="experience-title">Where I've worked.</h2>
        </Reveal>

        <ol className="timeline">
          {jobs.map((job, i) => (
            <li key={job.role + job.period} className="job">
              <Reveal delay={i * 100}>
                <article className="job__card glass">
                  <header className="job__head">
                    <h3 className="job__role">{job.role}</h3>
                    <p className="job__period">{job.period}</p>
                  </header>
                  <p className="job__company">{job.company}</p>
                  <ul className="job__points">
                    {job.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
