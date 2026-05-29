# Portfolio 3D Interactivo — Ra

Portfolio personal construido como una habitación 3D interactiva. El visitante orbita la escena, explora objetos y descubre la información del autor haciendo clic en cada elemento.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework UI | React 18 + TypeScript |
| 3D engine | Three.js vía **@react-three/fiber** |
| Helpers 3D | **@react-three/drei** (OrbitControls, Html, useGLTF, Environment…) |
| Build | Vite |
| Deploy | Vercel |
| Modelos | Blender → exportados como `.glb` |
| Programación | Asistida con IA (Claude Code) |

---

## Arquitectura

```
src/
├── App.tsx                  # Estado global, Canvas, overlays HTML
├── index.css                # Estilos globales
├── data/
│   └── portfolio.ts         # ★ TODA la configuración y contenido
└── components/
    ├── Scene.tsx             # Luces, controles de cámara, monta todos los modelos
    ├── Room.tsx              # habitacion.glb — entorno estático
    ├── InteractiveModel.tsx  # Objeto clickable: anillo + aguja + label + zoom
    ├── TableroDibujos.tsx    # Tablón (galería Arte) y tablet (CV iframe)
    ├── Character.tsx         # Personaje Ra animado — sección Sobre Mí
    ├── Altavoces.tsx         # Altavoces — control de música lofi
    ├── Fred.tsx              # Freddy — easter egg de sonido
    ├── InfoPanel.tsx         # Panel deslizante con contenido de cada sección
    ├── LoadingScreen.tsx     # Pantalla de carga 4s con logo y barra simulada
    ├── Clouds.tsx            # Nubes flotantes animadas
    ├── DecorativeModel.tsx   # Modelos decorativos sin interacción
    └── WasdControls.tsx      # Movimiento FPS (modo WASD)
```

### Modelos 3D

Todos los `.glb` viven en `Habitación/` y se sirven en la URL raíz:

```
Habitación/monitor.glb  →  /monitor.glb
```

`vite.config.ts` → `publicDir: 'Habitación/'`

---

## Funcionalidades

### Modos de navegación
- **Modo Órbita** — arrastra para orbitar, scroll para zoom, auto-rotación suave. Al salir de un zoom vuelve suavemente a la posición de órbita pre-zoom.
- **Modo WASD** — movimiento FPS con puntero bloqueado (Q/E altura, Shift correr). Al salir de un zoom recupera la posición y orientación exactas de antes del zoom.

### Objetos interactivos
Cada objeto tiene: anillo pulsante en el suelo · aguja 3D vertical · etiqueta flotante · glow de color · clic para abrir panel o zoom.

| Objeto | Sección | Comportamiento |
|---|---|---|
| Monitor | Proyectos | Panel lateral con enlace 🔗 |
| Teclado + Ratón + Torre PC | Habilidades | Hover compartido entre los 3 |
| Móvil | Contacto | Panel lateral |
| Arcade DK | Experiencia | Zoom a la arcade + panel + overlay retro |
| Tablón | Arte | Zoom + galería de ilustraciones → Canva |
| Tablet | CV | Zoom cenital + iframe CV (Canva embed) |
| Altavoces | Música | Toggle reproducción lofi + aguja ♫ tachada |
| Personaje Ra | Sobre Mí | Panel con bio, tags e intereses + botón CV |
| Pomni (peluche) | Easter egg | ¡Sorpresa! |
| Fred | Easter egg | Sonido honk |

### Paneles de información
- **Sobre Mí** — bio, tags, botón Ver Currículum (Canva)
- **Proyectos** — cards con descripción, tech y enlace 🔗
- **Habilidades** — 3D & Arte · Programación · Herramientas
- **Experiencia** — estilo arcade (EDUCA 360 · Prácticas)
- **Contacto** — email, GitHub, LinkedIn, Twitter/X
- **Arte** — galería de ilustraciones (tablón) → enlace Canva portfolio

### Overlays especiales
- **Arcade overlay** — pantalla de score estilo recreativa al abrir Experiencia
- **Board gallery** — fotos superpuestas a la escena 3D (pre-pintadas en DOM para evitar tirones)
- **CV iframe** — currículum Canva incrustado fullscreen (`/view?embed`)
- **Pantalla de carga** — logo + barra simulada 4 segundos + tip de exploración

---

## Configuración rápida

### ★ Todo el contenido en un archivo

```
src/data/portfolio.ts
```

### Alturas de aguja por objeto

```ts
// Objetos interactivos (INTERACTIVE_OBJECTS):
{ id: 'monitor', needleHeight: 1.5 }
{ id: 'arcade',  needleHeight: 4.2 }

// Tablón y tablet:
export const BOARD_NEEDLE_HEIGHTS = {
  tablon: 2.1,
  tablet: 0.3,
}
```

### Colores de sección

```ts
export const SECTION_COLORS = {
  projects:   '#00d4ff',  // cyan
  skills:     '#f59e0b',  // amber
  about:      '#a78bfa',  // violeta
  contact:    '#34d399',  // verde
  experience: '#fb923c',  // naranja
  easter:     '#f472b6',  // rosa
}
```

### Zoom de cámara (arcade)

```ts
{ zoomCamOffset: [0, 0.8, 2.0], zoomCamAngle: 90, zoomLookOffset: [0, 0.6, 0] }
```

### Zoom de tablet (cenital)

En `src/components/TableroDibujos.tsx`:
```ts
const CAM_OFFSETS = { tablet: new THREE.Vector3(0, 0.7, 0) }
```

---

## Comandos

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo → http://localhost:5173
npm run build     # build de producción (Vite)
npm run preview   # previsualizar el build
```

---

## Deploy en Vercel

El proyecto incluye el script `vercel-build` en `package.json`. Conecta el repo en [vercel.com](https://vercel.com) con:
- **Framework**: Vite
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`

---

## Modo de programación

Desarrollado con **programación asistida por IA** usando [Claude Code](https://claude.ai/code).

### Reglas de prompts recomendadas

1. **Contenido** → editar `src/data/portfolio.ts`
2. **Altura de agujas** → campo `needleHeight` en `INTERACTIVE_OBJECTS` o `BOARD_NEEDLE_HEIGHTS`
3. **Zoom de cámara** → `zoomCamOffset [x,y,z]` y `zoomCamAngle` en grados
4. **Nuevo objeto interactivo** → añadir a `INTERACTIVE_OBJECTS` con `id`, `modelPath`, `label`, `section`
5. **Nuevo modelo decorativo** → añadir a `DECORATIVE_MODELS`
6. **Estilos** → `src/index.css`, organizado por secciones con comentarios
7. **No tocar** sin motivo: `vite.config.ts` (publicDir = `Habitación/`) y `WasdControls.tsx`

### Tips

- GLBs se sirven desde `Habitación/` → nunca mover a `public/`
- `useGLTF.preload()` en `Scene.tsx` precarga todos los modelos al arrancar
- Etiquetas flotantes (`<Html>`) tienen `pointer-events: none`
- Modo WASD restaura posición + rotación pre-zoom con lerp suave
- Modo Órbita restaura posición pre-zoom con lerp suave sin flick
- `SECTION_COLORS` sincroniza anillo, aguja y label de cada sección
- El CV usa URL embed de Canva (`/view?embed`) para permitir iframe

---

## Créditos

- Modelos 3D por **Ra** en Blender
- Programación asistida con **Claude Code** (Anthropic)
- Música: lofi — uso personal
