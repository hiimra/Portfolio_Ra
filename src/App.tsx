import { useState, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './components/Scene'
import { InfoPanel } from './components/InfoPanel'
import { LoadingScreen } from './components/LoadingScreen'
import type { WasdControlsHandle } from './components/WasdControls'
import type { SectionKey } from './data/portfolio'

export default function App() {
  const [progress, setProgress]           = useState(0)
  const [loaded, setLoaded]               = useState(false)
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null)
  const [controlMode, setControlMode]     = useState<'orbit' | 'wasd'>('orbit')
  const [pointerLocked, setPointerLocked] = useState(false)
  const [hoveredLabel, setHoveredLabel]   = useState<{ text: string; color: string } | null>(null)

  const loadedRef = useRef(false)
  const wasdRef   = useRef<WasdControlsHandle>(null)

  const handleLoaded = useCallback(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    setTimeout(() => setLoaded(true), 600)
  }, [])

  const handleSelect = useCallback((section: SectionKey) => {
    // Si el puntero estaba bloqueado (WASD), lo liberamos antes de abrir el panel
    document.exitPointerLock()
    setActiveSection(section)
  }, [])

  const handleClose = useCallback(() => {
    setActiveSection(null)
    setHoveredLabel(null)
  }, [])

  const handleHover = useCallback((label: string | null, color: string | null) => {
    setHoveredLabel(label && color ? { text: label, color } : null)
  }, [])

  const handleLockChange = useCallback((locked: boolean) => {
    setPointerLocked(locked)
    if (!locked) setHoveredLabel(null)
  }, [])

  const toggleMode = useCallback(() => {
    setControlMode((m) => {
      if (m === 'wasd') {
        document.exitPointerLock()
        setPointerLocked(false)
        setHoveredLabel(null)
      }
      return m === 'orbit' ? 'wasd' : 'orbit'
    })
  }, [])

  const isWasdLocked = controlMode === 'wasd' && pointerLocked

  return (
    <div className="app">
      {/* Loading overlay */}
      <div className={`loading-overlay ${loaded ? 'loading-overlay--hidden' : ''}`}>
        <LoadingScreen progress={progress} />
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 3, 9], fov: 55 }} shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <Scene
          onSelect={handleSelect}
          onProgress={setProgress}
          onLoaded={handleLoaded}
          controlMode={controlMode}
          pointerLocked={pointerLocked}
          onLockChange={handleLockChange}
          onHover={handleHover}
          wasdRef={wasdRef}
        />
      </Canvas>

      {/* UI overlay */}
      <div className="ui-overlay">
        {/* Fila superior */}
        <div className="ui-top-row">
          <div className="brand">
            <span className="brand__name">Ra</span>
            <span className="brand__sep"> · </span>
            <span className="brand__role">3D Artist & Developer</span>
          </div>

          {loaded && (
            <button
              className={`mode-btn ${controlMode === 'wasd' ? 'mode-btn--active' : ''}`}
              onClick={toggleMode}
            >
              {controlMode === 'orbit'
                ? <><span className="mode-btn__icon">⊕</span> Modo WASD</>
                : <><span className="mode-btn__icon">↺</span> Modo Órbita</>}
            </button>
          )}
        </div>

        {/* Crosshair + etiqueta de objeto — solo en WASD bloqueado */}
        {isWasdLocked && (
          <div className="wasd-crosshair">
            <div
              className="crosshair-dot"
              style={hoveredLabel ? { background: hoveredLabel.color, boxShadow: `0 0 10px ${hoveredLabel.color}` } : {}}
            />
            {hoveredLabel && (
              <div
                className="crosshair-label"
                style={{ '--label-color': hoveredLabel.color } as React.CSSProperties}
              >
                <span className="hover-label__icon">▶</span>
                {hoveredLabel.text}
                <span className="crosshair-label__hint">clic para abrir</span>
              </div>
            )}
          </div>
        )}

        {/* Botones de altura — solo en modo WASD */}
        {loaded && controlMode === 'wasd' && (
          <div className="height-btns">
            <button
              className="height-btn"
              onPointerDown={() => wasdRef.current?.startVertical(1)}
              onPointerUp={() => wasdRef.current?.stopVertical()}
              onPointerLeave={() => wasdRef.current?.stopVertical()}
              title="Subir (Q)"
            >▲</button>
            <button
              className="height-btn"
              onPointerDown={() => wasdRef.current?.startVertical(-1)}
              onPointerUp={() => wasdRef.current?.stopVertical()}
              onPointerLeave={() => wasdRef.current?.stopVertical()}
              title="Bajar (E)"
            >▼</button>
          </div>
        )}

        {/* Hints inferiores */}
        {loaded && !activeSection && controlMode === 'orbit' && (
          <div className="hint-bar">
            <span>Arrastra para orbitar</span>
            <span className="hint-bar__sep">·</span>
            <span>Clic en los objetos para explorar</span>
          </div>
        )}

        {loaded && controlMode === 'wasd' && !pointerLocked && (
          <div className="hint-bar hint-bar--wasd">
            <span>Haz clic en la escena para activar el movimiento</span>
          </div>
        )}

        {loaded && isWasdLocked && (
          <div className="hint-bar hint-bar--wasd hint-bar--locked">
            <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>
            <span className="hint-bar__sep">·</span>
            <kbd>Q</kbd><span>sube</span>
            <kbd>E</kbd><span>baja</span>
            <span className="hint-bar__sep">·</span>
            <kbd>Shift</kbd><span>corre</span>
            <span className="hint-bar__sep">·</span>
            <kbd>ESC</kbd><span>salir</span>
          </div>
        )}
      </div>

      {/* Info panel */}
      <InfoPanel section={activeSection} onClose={handleClose} />
    </div>
  )
}
