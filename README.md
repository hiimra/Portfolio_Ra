# Portfolio 3D Interactivo — Ra

Portfolio personal construido como una habitación 3D interactiva. El visitante puede orbitar la escena, explorar objetos y descubrir la información del autor haciendo clic en cada elemento.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework UI | React 18 + TypeScript |
| 3D engine | Three.js vía **@react-three/fiber** |
| Helpers 3D | **@react-three/drei** (OrbitControls, Html, useGLTF, Environment…) |
| Build | Vite |
| Modelos | Blender → exportados como `.glb` |
| Programación | Asistida con IA (Claude Code) |

---

## Arquitectura

```
src/
├── App.tsx                  # Estado global, Canvas, overlays HTML
├── index.css                # Estilos globales (panel, labels, overlays)
├── data/
│   └── portfolio.ts         # ★ TODA la configuración y contenido del portfolio
└── components/
    ├── Scene.tsx             # Luces, OrbitControls, monta todos los modelos
    ├── Room.tsx              # habitacion.glb — entorno estático
    ├── InteractiveModel.tsx  # Objeto clickable: anillo + aguja + label + zoom
    ├── TableroDibujos.tsx    # Tablón (galería Arte) y tablet (CV iframe)
    ├── Character.tsx         # Personaje animado Ra — sección Sobre Mí
    ├── Altavoces.tsx         # Altavoces — control de música
    ├── Fred.tsx              # Freddy — easter egg de sonido
    ├── InfoPanel.tsx         # Panel deslizante con contenido de cada sección
    ├── LoadingScreen.tsx     # Pantalla de carga con logo y barra simulada
    ├── Clouds.tsx            # Nubes flotantes animadas
    ├── DecorativeModel.tsx   # Modelos decorativos sin interacción
    └── WasdControls.tsx      # Movimiento FPS (modo WASD)
```

### Flujo de interacción

```
Canvas → Scene → InteractiveModel
                     │
              clic → onSelect(section)
                     │
              App.tsx: activeSection
                     │
              InfoPanel se desliza
```

### Modelos 3D

Todos los `.glb` viven en `Habitación/` y se sirven en la URL raíz gracias al `publicDir` de Vite:

```
Habitación/monitor.glb  →  /monitor.glb
```

---

## Funcionalidades

### Navegación
- **Modo Órbita** — arrastra para orbitar, scroll para zoom, auto-rotación suave
- **Modo WASD** — movimiento FPS con puntero bloqueado, teclas Q/E para altura, Shift para correr

### Objetos interactivos
Cada objeto tiene:
- Anillo pulsante en el suelo (indicador de sección)
- Aguja 3D vertical con etiqueta flotante
- Glow de color al hacer hover
- Clic → abre panel o zoom de cámara

| Objeto | Sección | Comportamiento |
|---|---|---|
| Monitor | Proyectos | Abre panel lateral |
| Teclado / Ratón / Torre PC | Habilidades | Hover compartido entre los 3 |
| Móvil | Contacto | Abre panel lateral |
| Arcade DK | Experiencia | Zoom a la arcade + panel |
| Tablón | Arte | Zoom + galería de imágenes → Canva |
| Tablet | CV | Zoom cenital + iframe CV Canva |
| Altavoces | Música | Toggle reproducción lofi |
| Personaje Ra | Sobre Mí | Abre panel lateral |
| Pomni (peluche) | Easter egg | Sorpresa |
| Fred | Easter egg | Sonido |

### Paneles de información
- **Sobre Mí** — bio, tags de intereses, botón CV
- **Proyectos** — cards con descripción, tech stack y enlace
- **Habilidades** — categorías: 3D & Arte, Programación, Herramientas
- **Experiencia** — timeline estilo arcade
- **Contacto** — email, GitHub, LinkedIn, Twitter
- **Arte** — galería de ilustraciones con enlace a Canva
- **Easter egg** — ¡Encontraste a Pomni!

### Overlays especiales
- **Arcade overlay** — pantalla de score estilo recreativa al abrir Experiencia
- **Board gallery** — fotos del tablón superpuestas a la escena 3D
- **CV iframe** — currículum Canva incrustado en overlay fullscreen

---

## Configuración rápida

### Contenido del portfolio
Todo el texto, links y configuración de objetos está en un único archivo:

```
src/data/portfolio.ts
```

Edita `PORTFOLIO_DATA` para cambiar textos y `INTERACTIVE_OBJECTS` para ajustar objetos.

### Alturas de aguja por objeto

```ts
// En INTERACTIVE_OBJECTS (portfolio.ts):
{ id: 'monitor', ..., needleHeight: 1.5 }

// Para tablón y tablet:
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

### Zoom de cámara por objeto

```ts
{
  id: 'arcade',
  zoomCamOffset: [0, 0.8, 2.0],  // offset desde el centro del objeto
  zoomCamAngle: 90,               // rotación en grados
  zoomLookOffset: [0, 0.6, 0],    // ajuste del punto lookAt
}
```

---

## Comandos

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo → http://localhost:5173
npm run build     # build de producción (TypeScript check + Vite)
npm run preview   # previsualizar el build
```

---

## Modo de programación

Este proyecto fue desarrollado con **programación asistida por IA** usando [Claude Code](https://claude.ai/code).

### Reglas de prompts recomendadas

Para mantener la coherencia al pedir cambios:

1. **Cambios de contenido** → "Cambia el texto de X en portfolio.ts"
2. **Posición de objetos** → "Mueve la aguja de X a altura Y" (ajustar `needleHeight` en portfolio.ts)
3. **Zoom de cámara** → Especifica offset `[x, y, z]` y ángulo en grados
4. **Nuevos objetos interactivos** → Añadir a `INTERACTIVE_OBJECTS` en portfolio.ts con `id`, `modelPath`, `label`, `section`
5. **Nuevos modelos decorativos** → Añadir a `DECORATIVE_MODELS` en portfolio.ts
6. **Estilos** → Todos en `src/index.css`, organizados por secciones con comentarios
7. **No tocar** sin motivo: `vite.config.ts` (publicDir apunta a `Habitación/`), `WasdControls.tsx` (lógica compleja de pointer lock)

### Tips de desarrollo

- Los GLB se sirven desde `Habitación/` → URL raíz. Nunca mover a `public/`.
- `useGLTF.preload()` al final de Scene.tsx precarga todos los modelos al cargar la app.
- Las etiquetas flotantes (`<Html>` de drei) tienen `pointer-events: none` — no bloquean la escena 3D.
- El modo WASD guarda y restaura la posición de cámara antes/después de un zoom.
- El modo Órbita vuelve a la posición pre-zoom con lerp suave al cerrar.
- `SECTION_COLORS` sincroniza el color del anillo, la aguja y el label de cada sección.
- Para añadir un nuevo overlay HTML: añadir estado en App.tsx + componente + `position: fixed` en CSS.

---

## Créditos

- Todos los modelos 3D creados por **Ra** en Blender
- Programación asistida con **Claude Code** (Anthropic)
- Música: lofi — uso personal
