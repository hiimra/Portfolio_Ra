import { useState, useCallback, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './components/Scene'
import { InfoPanel } from './components/InfoPanel'
import { LoadingScreen } from './components/LoadingScreen'
import type { WasdControlsHandle } from './components/WasdControls'
import { INTERACTIVE_OBJECTS } from './data/portfolio'
import type { SectionKey } from './data/portfolio'

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

function ArcadeScreenOverlay() {
  return (
    <div className="arcade-screen-overlay">
      <div className="arcade-screen-overlay__score">
        <span className="arcade-score__label">SCORE</span>
        <span className="arcade-score__value"><ScoreCounter target={9847200} /></span>
      </div>
      <div className="arcade-screen-overlay__screen">
        <img
          className="arcade-screen-overlay__char"
          src="/ra_pixel.png"
          alt="Ra pixel art"
        />
      </div>
      <div className="arcade-screen-overlay__hud">
        <span className="arcade-score__label">1UP</span>
        <span className="arcade-cabinet__coin">INSERT COIN</span>
      </div>
      <div className="arcade-cabinet__controls">
        <span className="arcade-btn" />
        <span className="arcade-btn arcade-btn--b" />
        <span className="arcade-btn arcade-btn--c" />
      </div>
    </div>
  )
}

const CANVA_PORTFOLIO = 'https://canva.link/epkfa02vasqcz5g'

const BOARD_IMAGES: { src: string; alt: string }[] = [
  { src: '/gallery/DK_studio.png',     alt: 'DK Studio' },
  { src: '/gallery/Freddy.png',        alt: 'Freddy' },
  { src: '/gallery/ilustracion1.png',  alt: 'Ilustración' },
  { src: '/gallery/ilustracion_ra.png',alt: 'Ra' },
  { src: '/gallery/Popgoes.png',       alt: 'Popgoes' },
]

function CVOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.code === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="cv-overlay">
      <button className="cv-overlay__close" onClick={onClose} aria-label="Cerrar">✕</button>
      <iframe
        src="https://canva.link/wksgyac91oceg12"
        className="cv-overlay__frame"
        title="Currículum Ra"
        allow="fullscreen"
      />
    </div>
  )
}

function BoardGalleryOverlay({ onClose, visible }: { onClose: () => void; visible: boolean }) {
  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => { if (e.code === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, visible])

  return (
    <div className={`board-overlay ${visible ? '' : 'board-overlay--hidden'}`}>
      <button className="board-overlay__close" onClick={onClose} aria-label="Cerrar">✕</button>

      {BOARD_IMAGES.map(({ src, alt }, i) => (
        <a
          key={src}
          className={`board-overlay__sheet board-overlay__sheet--${i + 1}`}
          href={CANVA_PORTFOLIO}
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={src}
            alt={alt}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <span className="board-overlay__placeholder">{alt}</span>
        </a>
      ))}
    </div>
  )
}

export default function App() {
  const [progress, setProgress]           = useState(0)
  const [loaded, setLoaded]               = useState(false)
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null)
  const [controlMode, setControlMode]     = useState<'orbit' | 'wasd'>('orbit')
  const [pointerLocked, setPointerLocked] = useState(false)
  const [hoveredLabel, setHoveredLabel]   = useState<{ text: string; color: string } | null>(null)
  const [zoomedBoardId, setZoomedBoardId]     = useState<string | null>(null)
  const [overlayVisible, setOverlayVisible]   = useState(false)
  const [musicPlaying, setMusicPlaying]       = useState(false)

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const loadedRef      = useRef(false)
  const wasdRef        = useRef<WasdControlsHandle>(null)
  const inhibitLockRef = useRef(false)
  const controlModeRef = useRef(controlMode)
  const audioRef       = useRef<HTMLAudioElement | null>(null)
  useEffect(() => { controlModeRef.current = controlMode }, [controlMode])
  const hoverClearTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const audio = new Audio('/lofi_ncopy.mp3')
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio
    return () => { audio.pause(); audioRef.current = null }
  }, [])

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (musicPlaying) {
      audio.pause()
      setMusicPlaying(false)
    } else {
      audio.play().then(() => setMusicPlaying(true)).catch(() => {})
    }
  }, [musicPlaying])

  useEffect(() => {
    BOARD_IMAGES.forEach(({ src }) => {
      const img = new Image()
      img.src = src
      img.decode().catch(() => {})
    })
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const handleLoaded = useCallback(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    setTimeout(() => setLoaded(true), 4200)
  }, [])

  const handleSelect = useCallback((section: SectionKey) => {
    inhibitLockRef.current = true
    document.exitPointerLock()
    document.body.style.cursor = 'auto'
    setActiveSection(section)
  }, [])

  const handleClose = useCallback(() => {
    setActiveSection(null)
    setHoveredLabel(null)
    if (controlModeRef.current === 'wasd') {
      wasdRef.current?.lock()
    }
  }, [])

  const handleBoardZoom = useCallback((id: string | null) => {
    setZoomedBoardId(id)
    setOverlayVisible(id === 'tablon')
    if (id !== null) {
      document.exitPointerLock()
      document.body.style.cursor = 'auto'
    }
  }, [])

  const handleBoardClose = useCallback(() => {
    setOverlayVisible(false)
    setZoomedBoardId(null)
    if (controlModeRef.current === 'wasd') {
      wasdRef.current?.lock()
    }
  }, [])

  const handleHover = useCallback((label: string | null, color: string | null) => {
    if (label && color) {
      if (hoverClearTimer.current !== null) {
        clearTimeout(hoverClearTimer.current)
        hoverClearTimer.current = null
      }
      setHoveredLabel({ text: label, color })
    } else {
      hoverClearTimer.current = setTimeout(() => {
        hoverClearTimer.current = null
        setHoveredLabel(null)
      }, 20)
    }
  }, [])

  const handleLockChange = useCallback((locked: boolean) => {
    setPointerLocked(locked)
    if (!locked) {
      setHoveredLabel(null)
      document.body.style.cursor = 'auto'
    }
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
        <LoadingScreen />
      </div>

      {/* 3D Canvas — se estrecha al abrir el panel de experiencia para centrar la arcade */}
      <div className={`canvas-wrap ${activeSection === 'experience' ? 'canvas-wrap--arcade' : ''}`}>
      <Canvas
        camera={{ position: [0, 3, 9], fov: 55 }}
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        performance={{ min: 0.5 }}
      >
        <Scene
          onSelect={handleSelect}
          onProgress={setProgress}
          onLoaded={handleLoaded}
          controlMode={controlMode}
          pointerLocked={pointerLocked}
          onLockChange={handleLockChange}
          onHover={handleHover}
          wasdRef={wasdRef}
          inhibitLockRef={inhibitLockRef}
          zoomedBoardId={zoomedBoardId}
          onBoardZoom={handleBoardZoom}
          panelOpen={activeSection !== null}
          activeSection={activeSection}
          musicPlaying={musicPlaying}
          onMusicToggle={toggleMusic}
        />
      </Canvas>
      </div>

      {/* Board gallery overlay — siempre en DOM, visibility:hidden cuando no activo */}
      <BoardGalleryOverlay onClose={handleBoardClose} visible={overlayVisible} />

      {/* CV overlay — tablet */}
      {zoomedBoardId === 'tablet' && <CVOverlay onClose={handleBoardClose} />}

      {/* UI overlay */}
      <div className="ui-overlay">
        {/* Fila superior */}
        <div className="ui-top-row">
          <div className="brand">
            <span className="brand__name">Ra</span>
            <span className="brand__sep"> · </span>
            <span className="brand__role">3D Artist & Animator</span>
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

        {/* Crosshair — solo en WASD bloqueado */}
        {isWasdLocked && (
          <div className="wasd-crosshair">
            <div
              className="crosshair-dot"
              style={hoveredLabel ? { background: hoveredLabel.color, boxShadow: `0 0 10px ${hoveredLabel.color}` } : {}}
            />
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

      {/* Arcade screen overlay — solo cuando la experiencia está activa */}
      {activeSection === 'experience' && <ArcadeScreenOverlay />}

      {/* Info panel */}
      <InfoPanel section={activeSection} onClose={handleClose} />
    </div>
  )
}
