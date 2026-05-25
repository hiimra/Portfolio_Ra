import { useEffect } from 'react'
import { PORTFOLIO_DATA, type SectionKey } from '../data/portfolio'

interface Props {
  section: SectionKey | null
  onClose: () => void
}

export function InfoPanel({ section, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <>
      {section && (
        <div className="panel-backdrop" onClick={onClose} />
      )}
      <div className={`info-panel ${section ? 'info-panel--visible' : ''}`}>
        <button className="info-panel__close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        {section === 'about' && <AboutSection />}
        {section === 'projects' && <ProjectsSection />}
        {section === 'skills' && <SkillsSection />}
        {section === 'experience' && <ExperienceSection />}
        {section === 'contact' && <ContactSection />}
        {section === 'easter' && <EasterSection />}
      </div>
    </>
  )
}

function AboutSection() {
  const { about, name, tagline } = PORTFOLIO_DATA
  return (
    <div className="panel-content">
      <div className="panel-header">
        <span className="panel-tag">about_me.txt</span>
        <h2 className="panel-title">{name}</h2>
        <p className="panel-subtitle">{tagline}</p>
      </div>
      <p className="panel-body">{about.bio}</p>
      <div className="tag-list">
        {about.interests.map((i) => (
          <span key={i} className="tag">{i}</span>
        ))}
      </div>
    </div>
  )
}

function ProjectsSection() {
  const { projects } = PORTFOLIO_DATA
  return (
    <div className="panel-content">
      <div className="panel-header">
        <span className="panel-tag">projects/</span>
        <h2 className="panel-title">Proyectos</h2>
      </div>
      <div className="project-list">
        {projects.map((p) => (
          <div key={p.title} className="project-card">
            <div className="project-card__header">
              <h3 className="project-card__title">{p.title}</h3>
              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer" className="project-card__link">
                  ↗
                </a>
              )}
            </div>
            <p className="project-card__desc">{p.description}</p>
            <div className="tag-list">
              {p.tech.map((t) => (
                <span key={t} className="tag tag--tech">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillsSection() {
  const { skills } = PORTFOLIO_DATA
  return (
    <div className="panel-content">
      <div className="panel-header">
        <span className="panel-tag">skills.json</span>
        <h2 className="panel-title">Habilidades</h2>
      </div>
      {Object.entries(skills).map(([category, items]) => (
        <div key={category} className="skill-group">
          <h3 className="skill-group__title">{category}</h3>
          <div className="tag-list">
            {items.map((s) => (
              <span key={s} className="tag">{s}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ExperienceSection() {
  const { experience } = PORTFOLIO_DATA
  return (
    <div className="panel-content">
      <div className="panel-header">
        <span className="panel-tag">experience.md</span>
        <h2 className="panel-title">Experiencia</h2>
      </div>
      {experience.map((e) => (
        <div key={e.role} className="exp-card">
          <div className="exp-card__period">{e.period}</div>
          <h3 className="exp-card__role">{e.role}</h3>
          <p className="exp-card__company">{e.company}</p>
          <p className="exp-card__desc">{e.description}</p>
        </div>
      ))}
    </div>
  )
}

function ContactSection() {
  const { contact } = PORTFOLIO_DATA
  return (
    <div className="panel-content">
      <div className="panel-header">
        <span className="panel-tag">contact.html</span>
        <h2 className="panel-title">Contacto</h2>
        <p className="panel-subtitle">¿Tienes un proyecto en mente? ¡Hablemos!</p>
      </div>
      <div className="contact-list">
        <a href={`mailto:${contact.email}`} className="contact-item">
          <span className="contact-item__icon">✉</span>
          <span>{contact.email}</span>
        </a>
        {contact.github && (
          <a href={contact.github} target="_blank" rel="noreferrer" className="contact-item">
            <span className="contact-item__icon">⌥</span>
            <span>GitHub</span>
          </a>
        )}
        {contact.linkedin && (
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="contact-item">
            <span className="contact-item__icon">in</span>
            <span>LinkedIn</span>
          </a>
        )}
      </div>
    </div>
  )
}

function EasterSection() {
  const { easter } = PORTFOLIO_DATA
  return (
    <div className="panel-content panel-content--easter">
      <div className="easter-glyph">🎪</div>
      <h2 className="panel-title">{easter.message}</h2>
      <p className="panel-body">{easter.detail}</p>
    </div>
  )
}
