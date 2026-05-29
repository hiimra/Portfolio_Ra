# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

3D interactive portfolio website. A first-person/orbit-around room scene built with React Three Fiber. Visitors orbit the room and click on objects (monitor, keyboard, PC, speakers, tablet, bookshelf, Pomni plushie) to open portfolio panels.

## Commands

```bash
npm install          # install dependencies (run once)
npm run dev          # start dev server at http://localhost:5173
npm run build        # TypeScript check + Vite production build
npm run preview      # preview the production build locally
```

## Architecture

### 3D Models (served as static files)
All `.glb` files live in `Habitación/` and are served at the root URL via `publicDir` in `vite.config.ts`. E.g. `Habitación/monitor.glb` → `/monitor.glb`.

### Key files
- [src/data/portfolio.ts](src/data/portfolio.ts) — **all customizable content lives here**: bio, projects, skills, experience, contact, and which model maps to which section
- [src/components/Scene.tsx](src/components/Scene.tsx) — lights, OrbitControls, loads all models; also bridges loading progress to the React tree
- [src/components/InteractiveModel.tsx](src/components/InteractiveModel.tsx) — loads a single GLB, adds hover scale + `<Html>` tooltip, fires `onSelect` on click
- [src/components/Room.tsx](src/components/Room.tsx) — loads `habitacion.glb` as the static environment
- [src/components/InfoPanel.tsx](src/components/InfoPanel.tsx) — slide-in panel (right edge) with all portfolio section content
- [src/components/Clouds.tsx](src/components/Clouds.tsx) — `nube_01/02/03.glb` with `useFrame` float animation

### Interaction model
1. `<Canvas>` (App.tsx) → `<Scene>` → individual `<InteractiveModel>` components
2. Click on an object → `onSelect(section)` → `activeSection` state in App.tsx → `<InfoPanel>` slides in
3. Escape key or backdrop click → closes panel
4. Loading: `useProgress` from drei inside Canvas fires `onProgress`/`onLoaded` callbacks up to App.tsx; loading overlay fades out on completion

### Adding the character model
When the character model is ready, add it to `Habitación/`, then either:
- Add it to `DECORATIVE_MODELS` in `portfolio.ts` for a static prop
- Add an entry to `INTERACTIVE_OBJECTS` with its own section to make it clickable

### Customizing portfolio content
Edit `src/data/portfolio.ts` — change `PORTFOLIO_DATA` for text content and `INTERACTIVE_OBJECTS` for object-to-section mappings.
