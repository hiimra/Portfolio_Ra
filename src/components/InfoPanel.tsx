<<<<<<< HEAD
import { useEffect, useRef, useState } from 'react'
=======
<<<<<<< HEAD
import { useEffect, useRef, useState } from 'react'
=======
import { useEffect } from 'react'
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
import { PORTFOLIO_DATA, type SectionKey } from '../data/portfolio'

interface Props {
  section: SectionKey | null
  onClose: () => void
}

export function InfoPanel({ section, onClose }: Props) {
<<<<<<< HEAD
  const closeRef = useRef<HTMLButtonElement>(null)

=======
<<<<<<< HEAD
  const closeRef = useRef<HTMLButtonElement>(null)

=======
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
  // When panel opens, focus the close button so the user can close with Enter/Space
  useEffect(() => {
    if (section) {
      const t = setTimeout(() => closeRef.current?.focus(), 350)
      return () => clearTimeout(t)
    }
  }, [section])

  const isArcade = section === 'experience'

<<<<<<< HEAD
=======
=======
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
  return (
    <>
      {section && (
        <div className="panel-backdrop" onClick={onClose} />
      )}
<<<<<<< HEAD
      <div className={`info-panel ${section ? 'info-panel--visible' : ''} ${isArcade ? 'info-panel--arcade' : ''}`}>
        <button ref={closeRef} className="info-panel__close" onClick={onClose} aria-label="Cerrar">
=======
<<<<<<< HEAD
      <div className={`info-panel ${section ? 'info-panel--visible' : ''} ${isArcade ? 'info-panel--arcade' : ''}`}>
        <button ref={closeRef} className="info-panel__close" onClick={onClose} aria-label="Cerrar">
=======
      <div className={`info-panel ${section ? 'info-panel--visible' : ''}`}>
        <button className="info-panel__close" onClick={onClose} aria-label="Cerrar">
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
          ✕
        </button>
        {section === 'about' && <AboutSection />}
        {section === 'projects' && <ProjectsSection />}
        {section === 'skills' && <SkillsSection />}
<<<<<<< HEAD
        {section === 'experience' && <ArcadeExperienceSection />}
=======
<<<<<<< HEAD
        {section === 'experience' && <ArcadeExperienceSection />}
=======
        {section === 'experience' && <ExperienceSection />}
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
      <a
        href="https://canva.link/wksgyac91oceg12"
        target="_blank"
        rel="noreferrer"
        className="cv-btn"
      >
        <span className="cv-btn__icon">↗</span>
        Ver Currículum
      </a>
<<<<<<< HEAD
=======
=======
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
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
<<<<<<< HEAD
                  🔗
=======
<<<<<<< HEAD
                  🔗
=======
                  ↗
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
function ScoreCounter({ target }: { target: number }) {
  const [score, setScore] = useState(0)
  useEffect(() => {
    let current = 0
    const step = Math.ceil(target / 70)
    const id = setInterval(() => {
      current = Math.min(current + step, target)
      setScore(current)
      if (current >= target) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [target])
  return <>{String(score).padStart(7, '0')}</>
}

function ArcadeExperienceSection() {
  const { experience } = PORTFOLIO_DATA
  const all = experience
<<<<<<< HEAD
=======
=======
function ExperienceSection() {
  const { experience } = PORTFOLIO_DATA
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
  return (
    <div className="panel-content">
      <div className="panel-header">
        <span className="panel-tag">experience.md</span>
        <h2 className="panel-title">Experiencia</h2>
      </div>
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
      {all.map((e) => (
        <div key={e.role} className="exp-card">
          <h3 className="exp-card__role">{e.company}</h3>
          <div className="exp-card__period">{e.period}</div>
<<<<<<< HEAD
=======
=======
      {experience.map((e) => (
        <div key={e.role} className="exp-card">
          <div className="exp-card__period">{e.period}</div>
          <h3 className="exp-card__role">{e.role}</h3>
          <p className="exp-card__company">{e.company}</p>
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
        {contact.twitter && (
          <a href={contact.twitter} target="_blank" rel="noreferrer" className="contact-item">
            <span className="contact-item__icon">𝕏</span>
            <span>Twitter / X</span>
          </a>
        )}
<<<<<<< HEAD
=======
=======
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
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
