export type SectionKey = 'about' | 'projects' | 'skills' | 'contact' | 'experience' | 'easter'

// Color por sección — se usa para el anillo indicador de cada objeto interactivo
export const SECTION_COLORS: Record<SectionKey, string> = {
  projects:   '#00d4ff',  // cyan
  skills:     '#f59e0b',  // amber
  about:      '#a78bfa',  // violeta
  contact:    '#34d399',  // verde
  experience: '#fb923c',  // naranja
  easter:     '#f472b6',  // rosa
}

export interface Project {
  title: string
  description: string
  tech: string[]
  link?: string
}

export interface Experience {
  role: string
  company: string
  period: string
  description: string
}

export const PORTFOLIO_DATA = {
  name: 'Ra',
  tagline: '3D Artist & Developer',

  about: {
    bio: 'Apasionado del modelado 3D, el diseño y la creación de experiencias web interactivas. Me especializo en la creación de entornos tridimensionales y aplicaciones inmersivas que combinan arte y código.',
    interests: ['Modelado 3D', 'Blender', 'Desarrollo Web', 'Animación', 'Game Design'],
  },

  projects: [
    {
      title: 'Portfolio 3D Interactivo',
      description: 'Portfolio personal construido con Three.js y React Three Fiber. Todos los modelos 3D fueron creados en Blender.',
      tech: ['React', 'Three.js', 'Blender', 'TypeScript'],
      link: 'https://github.com/hiimra/Portfolio_Ra',
    },
    {
      title: 'Proyecto 2',
      description: 'Descripción del proyecto. Edita src/data/portfolio.ts para personalizarlo con tus proyectos reales.',
      tech: ['Next.js', 'TailwindCSS'],
    },
    {
      title: 'Proyecto 3',
      description: 'Descripción del tercer proyecto. Aquí puedes mostrar cualquier trabajo de 3D, web o diseño.',
      tech: ['Blender', 'After Effects'],
    },
  ] as Project[],

  skills: {
    '3D & Arte': ['Blender', 'Modelado', 'Texturizado', 'Rigging', 'Animación 3D', 'Iluminación'],
    'Desarrollo Web': ['React', 'TypeScript', 'Three.js', 'CSS/SCSS', 'HTML', 'JavaScript'],
    'Herramientas': ['Git', 'VS Code', 'Figma', 'After Effects'],
  } as Record<string, string[]>,

  experience: [
    {
      role: 'Diseñador & Desarrollador 3D',
      company: 'Freelance',
      period: '2023 — Presente',
      description: 'Creación de modelos, escenas 3D y aplicaciones web interactivas para proyectos personales y colaboraciones.',
    },
  ] as Experience[],

  contact: {
    email: 'tu@email.com',
    github: 'https://github.com/hiimra',
    linkedin: 'https://linkedin.com/in/tu-perfil',
  },

  easter: {
    message: '¡Encontraste a Pomni!',
    detail: 'Personaje de The Amazing Digital Circus. "Estar en este mundo no es lo que esperaba... pero aquí estoy."',
  },
}

export interface InteractiveObjectConfig {
  id: string
  modelPath: string
  label: string
  section: SectionKey
  hint: string
}

// Objects loaded individually for interaction — all share the same world origin as the room
export const INTERACTIVE_OBJECTS: InteractiveObjectConfig[] = [
  { id: 'monitor',    modelPath: '/monitor.glb',          label: 'Proyectos',   section: 'projects',    hint: 'Ver mis proyectos' },
  { id: 'teclado',    modelPath: '/teclado.glb',           label: 'Habilidades', section: 'skills',      hint: 'Mi stack técnico' },
  { id: 'raton',      modelPath: '/raton_ordenador.glb',   label: 'Habilidades', section: 'skills',      hint: 'Mi stack técnico' },
  { id: 'torre',      modelPath: '/Torre_pc.glb',          label: 'Stack',       section: 'skills',      hint: 'Tecnologías que uso' },
  { id: 'altavoces',  modelPath: '/altavoces.glb',         label: 'Sobre Mí',    section: 'about',       hint: 'Conóceme' },
  { id: 'tablet',     modelPath: '/tablet.glb',            label: 'Contacto',    section: 'contact',     hint: '¡Hablemos!' },
  { id: 'estanteria', modelPath: '/estanteria_baldas.glb', label: 'Experiencia', section: 'experience',  hint: 'Mi trayectoria' },
  { id: 'peluche',    modelPath: '/peluche_pomni.glb',     label: '?',           section: 'easter',      hint: 'Toca para descubrir' },
]

// Static decorative objects (no interaction)
export const DECORATIVE_MODELS: string[] = [
  '/escritrorio.glb',
  '/silla_oficina.glb',
  '/estateria_flotante.glb',
  '/fleso.glb',
]

// Clouds — phase desincroniza cada nube, yBase las eleva por encima de la habitación
// Ajusta yBase si las nubes siguen apareciendo dentro del cuarto
export const CLOUD_CONFIGS = [
  { path: '/nube_01.glb', phase: 0,              yBase: 4.5 },
  { path: '/nube_02.glb', phase: Math.PI * 0.66, yBase: 5.2 },
  { path: '/nube_03.glb', phase: Math.PI * 1.33, yBase: 4.0 },
]
