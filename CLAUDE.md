# CLAUDE.md

Guía para Claude Code al trabajar en este repositorio.

## Overview

Portfolio 3D interactivo. Habitación en React Three Fiber donde el visitante orbita/camina y hace clic en objetos para ver el contenido del portfolio.

## Comandos

```bash
npm install          # instalar dependencias (una vez)
npm run dev          # servidor de desarrollo → http://localhost:5173
npm run build        # build producción (Vite)
npm run preview      # previsualizar build
```

## Arquitectura

### Modelos 3D
Todos los `.glb` viven en `Habitación/` y se sirven en la URL raíz via `publicDir` en `vite.config.ts`.
`Habitación/monitor.glb` → `/monitor.glb`

### Archivos clave
- `src/data/portfolio.ts` — **todo el contenido** del portfolio y configuración de objetos
- `src/components/Scene.tsx` — luces, OrbitControls/WasdControls, monta todos los modelos, gestiona zoom de cámara
- `src/components/InteractiveModel.tsx` — objeto clickable: anillo + aguja + etiqueta flotante + zoom
- `src/components/TableroDibujos.tsx` — tablón (galería Arte) y tablet (CV iframe cenital)
- `src/components/InfoPanel.tsx` — panel deslizante con todo el contenido por sección
- `src/components/LoadingScreen.tsx` — pantalla de carga 4s con logo, barra simulada y tip
- `src/components/Altavoces.tsx` — control de música (lofi toggle) con aguja y ♫ tachada

### Sistema de etiquetas flotantes (agujas)
Cada objeto interactivo tiene: anillo pulsante en el suelo → aguja vertical → etiqueta `<Html>` encima.
- Altura de aguja: `needleHeight` en `INTERACTIVE_OBJECTS` (portfolio.ts) o `BOARD_NEEDLE_HEIGHTS`
- Etiquetas se ocultan cuando hay panel o zoom activo (`panelOpen`, `isMeZoomed`)
- Hover compartido por sección: teclado/ratón/torre iluminan la misma etiqueta "Habilidades"

### Modos de cámara
- **Órbita**: `OrbitControls` con auto-rotación. Al cerrar un zoom, `CameraZoomReturn` (modo orbit) devuelve la cámara suavemente a la posición pre-zoom antes de remontar OrbitControls.
- **WASD**: puntero bloqueado, movimiento FPS. Al cerrar un zoom, `CameraZoomReturn` (modo wasd) devuelve posición + rotación con lerp.

### Flujo de interacción
1. Clic en objeto → `onSelect(section)` o `onBoardZoom(id)` en App.tsx
2. Panel de info: `activeSection` → `<InfoPanel>` se desliza desde la derecha
3. Zoom de arcade: `InteractiveModel.useFrame` mueve la cámara hacia el objeto
4. Zoom de tablón/tablet: `TableroDibujos.useFrame` mueve la cámara hacia el modelo
5. Zoom de tablet: vista cenital + iframe CV Canva (`/view?embed`)
6. Cerrar → `CameraZoomReturn` restaura posición pre-zoom

### Overlays HTML
- `BoardGalleryOverlay` — siempre en DOM (`visibility:hidden` cuando inactivo) para evitar tirones
- `CVOverlay` — iframe Canva embed, solo se monta cuando `zoomedBoardId === 'tablet'`
- `ArcadeScreenOverlay` — overlay retro cuando `activeSection === 'experience'`

## Configuración de contenido

Editar `src/data/portfolio.ts`:
- `PORTFOLIO_DATA` — textos bio, proyectos, habilidades, experiencia, contacto
- `INTERACTIVE_OBJECTS` — objetos clickables con `needleHeight`, `zoomCamOffset`, etc.
- `BOARD_NEEDLE_HEIGHTS` — alturas de aguja para tablón y tablet
- `SECTION_COLORS` — color de anillo/aguja/label por sección

## Reglas importantes

- Los GLB SIEMPRE en `Habitación/`, nunca en `public/`
- `useGLTF.preload()` al final de Scene.tsx para precargar todos los modelos
- CV iframe usa URL embed de Canva (`/view?embed`), no la URL de compartir normal
- `WasdControls.tsx` — lógica compleja de pointer lock, no tocar sin motivo
- `vite.config.ts` — `publicDir: 'Habitación/'`, no cambiar
- Etiquetas `<Html>` tienen `pointer-events: none` para no bloquear la escena 3D
