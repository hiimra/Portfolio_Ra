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

<<<<<<< HEAD

export const PORTFOLIO_DATA = {
  name: 'Ra',
  tagline: '3D Artist & Animator',

  about: {
    bio: 'Apasionado del modelado 3D, el diseño y la creación de experiencias visuales. Animación enfocada a 3D, 2D e ilustración, concept-art y comisiones.',
    interests: ['Creatividad', 'Adaptación', 'Dotes de liderazgo', 'Trabajo en equipo', 'Vocación en el dibujo', 'Trabajador', 'Con muchas ganas de aprender y crear'],
=======
export const PORTFOLIO_DATA = {
  name: 'Ra',
  tagline: '3D Artist & Developer',

  about: {
    bio: 'Apasionado del modelado 3D, el diseño y la creación de experiencias web interactivas. Me especializo en la creación de entornos tridimensionales y aplicaciones inmersivas que combinan arte y código.',
    interests: ['Modelado 3D', 'Blender', 'Desarrollo Web', 'Animación', 'Game Design'],
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
  },

  projects: [
    {
      title: 'Portfolio 3D Interactivo',
<<<<<<< HEAD
      description: 'Portfolio personal con escena 3D interactiva. Todos los modelos fueron creados en Blender. Programación asistida con IA.',
      tech: ['Blender', 'Programación asistida con IA'],
      link: 'https://github.com/hiimra/Portfolio_Ra',
    },
    {
      title: 'Modelos 3D — Sketchfab',
      description: 'Colección de modelados 3D: personajes, entornos y props creados en Blender.',
      tech: ['Blender', 'Modelado 3D', 'Texturizado'],
      link: 'https://sketchfab.com/r4_ULcesur',
=======
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
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
    },
  ] as Project[],

  skills: {
    '3D & Arte': ['Blender', 'Modelado', 'Texturizado', 'Rigging', 'Animación 3D', 'Iluminación'],
<<<<<<< HEAD
    'Programación': ['Programación asistida con IA'],
    'Herramientas': ['Blender', 'Premiere', 'After Effects', 'Unity', 'Procreate', 'ClipStudio', 'Aseprite'],
=======
    'Desarrollo Web': ['React', 'TypeScript', 'Three.js', 'CSS/SCSS', 'HTML', 'JavaScript'],
    'Herramientas': ['Git', 'VS Code', 'Figma', 'After Effects'],
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
  } as Record<string, string[]>,

  experience: [
    {
<<<<<<< HEAD
      role: 'Técnico Superior Animación 3D y 2D',
      company: 'EDUCA 360 — Cesur Cartuja',
      period: '3 meses',
      description: 'Animación 3D y 2D, modelado, rigging, texturizado, iluminación e inteligencia artificial.',
    },
    {
      role: 'Modelado & Entornos Interactivos',
      company: 'Making of',
      period: '2 meses',
      description: 'Proyectos de modelado, animación y creación de entornos interactivos.',
=======
      role: 'Diseñador & Desarrollador 3D',
      company: 'Freelance',
      period: '2023 — Presente',
      description: 'Creación de modelos, escenas 3D y aplicaciones web interactivas para proyectos personales y colaboraciones.',
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
    },
  ] as Experience[],

  contact: {
<<<<<<< HEAD
    email: 'hi.imra95@gmail.com',
    github: 'https://github.com/hiimra',
    linkedin: 'https://www.linkedin.com/in/raúlcamposcáceres/',
    twitter: 'https://twitter.com/hiimra006',
=======
    email: 'tu@email.com',
    github: 'https://github.com/hiimra',
    linkedin: 'https://linkedin.com/in/tu-perfil',
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
  },

  easter: {
    message: '¡Encontraste a Pomni!',
<<<<<<< HEAD
    detail: 'Personaje de The Amazing Digital Circus.\n"¿Qué es este lugar? ¿Por qué estoy aquí?"',
=======
    detail: 'Personaje de The Amazing Digital Circus. "Estar en este mundo no es lo que esperaba... pero aquí estoy."',
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
  },
}

export interface InteractiveObjectConfig {
  id: string
  modelPath: string
  label: string
  section: SectionKey
  hint: string
<<<<<<< HEAD
  // Opcionales: sobrescriben la posición/rotación/escala del GLB exportado
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?:    [number, number, number]
  // Si se define, la cámara hace zoom hacia el objeto al abrir su panel
  zoomCamOffset?: [number, number, number]
  // Rotación horizontal de la posición de zoom en grados (0 = frente +Z, 90 = izq, -90 = der)
  zoomCamAngle?: number
  // Desplazamiento del punto lookAt respecto al centro del bounding box
  zoomLookOffset?: [number, number, number]
  // Oculta la etiqueta flotante (para objetos del mismo grupo con otro que ya la muestra)
  hideLabel?: boolean
  // Altura de la aguja del indicador en unidades de escena (por defecto 0.58)
  needleHeight?: number
}

// Objects loaded individually for interaction — all share the same world origin as the room
// Añade position/rotation/scale a cualquier objeto para moverlo sin tocar Blender.
// Ejemplo: { id: 'tablet', ..., position: [1.2, 0.8, -0.5], rotation: [0, Math.PI/2, 0] }
export const INTERACTIVE_OBJECTS: InteractiveObjectConfig[] = [
  { id: 'monitor',    modelPath: '/monitor.glb',          label: 'Proyectos',   section: 'projects',    hint: 'Ver mis proyectos',   needleHeight: 1.5 },
  { id: 'teclado',    modelPath: '/teclado.glb',           label: 'Habilidades', section: 'skills',      hint: 'Mi stack técnico', hideLabel: true },
  { id: 'raton',      modelPath: '/raton_ordenador.glb',   label: 'Habilidades', section: 'skills',      hint: 'Mi stack técnico', hideLabel: true },
  { id: 'torre',      modelPath: '/Torre_pc.glb',          label: 'Habilidades', section: 'skills',      hint: 'Tecnologías que uso', needleHeight: 0.8 },
  { id: 'movil',      modelPath: '/movil.glb',             label: 'Contacto',    section: 'contact',     hint: '¡Hablemos!' },
  { id: 'arcade',     modelPath: '/arcade_Dk.glb',         label: 'Experiencia', section: 'experience',  hint: 'Mi trayectoria',      needleHeight: 4.2, zoomCamOffset: [0, 0.8, 2.0], zoomCamAngle: 90, zoomLookOffset: [0, 0.6, 0] },
  { id: 'peluche',    modelPath: '/peluche_pomni.glb',     label: '?',           section: 'easter',      hint: 'Toca para descubrir', needleHeight: 0.9 },
]

// Alturas de aguja para tablón y tablet (ajusta aquí sin tocar los componentes)
export const BOARD_NEEDLE_HEIGHTS: Record<string, number> = {
  tablon: 2.1,
  tablet: 0.3,
}

=======
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

>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
// Static decorative objects (no interaction)
export const DECORATIVE_MODELS: string[] = [
  '/escritrorio.glb',
  '/silla_oficina.glb',
  '/estateria_flotante.glb',
  '/fleso.glb',
<<<<<<< HEAD
  '/cama.glb',
  '/alfombra_tematizada.glb',
  '/cajas.glb',
  '/lapicero.glb',
  '/papelera.glb',
]

// Clouds — xBase/yBase/zBase = posición central de cada nube
// phase desincroniza la oscilación. El swing es pequeño (±0.35 u.) para que
// se mantengan cerca de su posición sin desplazarse demasiado.
export const CLOUD_CONFIGS = [
  { path: '/nube_01.glb', phase: 0,              xBase:  2.5, yBase:  -1.0, zBase: 0.0 },
  { path: '/nube_02.glb', phase: Math.PI * 0.66, xBase: 0.0, yBase: -0.5, zBase:  0.0 },
  { path: '/nube_03.glb', phase: Math.PI * 1.33, xBase:  1.0, yBase: -0.5, zBase:  0.0 },
=======
]

// Clouds — phase desincroniza cada nube, yBase las eleva por encima de la habitación
// Ajusta yBase si las nubes siguen apareciendo dentro del cuarto
export const CLOUD_CONFIGS = [
  { path: '/nube_01.glb', phase: 0,              yBase: 4.5 },
  { path: '/nube_02.glb', phase: Math.PI * 0.66, yBase: 5.2 },
  { path: '/nube_03.glb', phase: Math.PI * 1.33, yBase: 4.0 },
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
]
