<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { OrbitControls, Environment, useProgress, Html, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
<<<<<<< HEAD
=======
=======
import { Suspense } from 'react'
import { OrbitControls, Environment, useProgress } from '@react-three/drei'
import { useEffect, type RefObject } from 'react'
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
import { Room } from './Room'
import { InteractiveModel } from './InteractiveModel'
import { DecorativeModel } from './DecorativeModel'
import { Clouds } from './Clouds'
import { WasdControls, type WasdControlsHandle } from './WasdControls'
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
import { Character } from './Character'
import { Fred } from './Fred'
import { Altavoces } from './Altavoces'
import { TableroDibujos } from './TableroDibujos'
import { INTERACTIVE_OBJECTS, DECORATIVE_MODELS, BOARD_NEEDLE_HEIGHTS, type SectionKey } from '../data/portfolio'

// ── Pon en true para ver esferas de color en cada fuente de luz ──────────────
const DEBUG_LIGHTS = false

function LightMarker({ position, color, label }: { position: [number,number,number]; color: string; label: string }) {
  if (!DEBUG_LIGHTS) return null
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.12, 12, 12]} />
      <meshBasicMaterial color={color} />
      <Html center style={{ pointerEvents: 'none', userSelect: 'none', fontSize: 11, color, whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.55)', padding: '1px 5px', borderRadius: 3 }}>
        {label}
      </Html>
    </mesh>
  )
}

// Guarda posición+rotación antes del zoom y vuelve a ella suavemente al salir
function CameraZoomReturn({ isZooming, onReturning }: {
  isZooming: boolean
  onReturning?: (v: boolean) => void
}) {
  const { camera } = useThree()
  const savedPos   = useRef(new THREE.Vector3())
  const savedQuat  = useRef(new THREE.Quaternion())
  const wasZooming = useRef(false)
  const [active, setActive] = useState(false)

  useLayoutEffect(() => {
    if (isZooming && !wasZooming.current) {
      savedPos.current.copy(camera.position)
      savedQuat.current.copy(camera.quaternion)
      wasZooming.current = true
    } else if (!isZooming && wasZooming.current) {
      wasZooming.current = false
      setActive(true)
      onReturning?.(true)
    }
  }, [isZooming, camera, onReturning])

  useFrame(() => {
    if (!active) return
    camera.position.copy(savedPos.current)
    camera.quaternion.copy(savedQuat.current)
    camera.up.set(0, 1, 0)
    setActive(false)
    onReturning?.(false)
  })
  return null
}
<<<<<<< HEAD
=======
=======
import { INTERACTIVE_OBJECTS, DECORATIVE_MODELS, type SectionKey } from '../data/portfolio'
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0

function ProgressBridge({ onProgress, onLoaded }: { onProgress: (p: number) => void; onLoaded: () => void }) {
  const { progress, active } = useProgress()
  useEffect(() => {
    onProgress(progress)
    if (!active && progress > 0) onLoaded()
  }, [progress, active, onProgress, onLoaded])
  return null
}

interface SceneProps {
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
  onSelect:         (section: SectionKey) => void
  onProgress:       (p: number) => void
  onLoaded:         () => void
  onLockChange:     (locked: boolean) => void
  onHover:          (label: string | null, color: string | null) => void
  controlMode:      'orbit' | 'wasd'
  pointerLocked:    boolean
  wasdRef:          RefObject<WasdControlsHandle>
  inhibitLockRef:   React.MutableRefObject<boolean>
  zoomedBoardId:    string | null
  onBoardZoom:      (id: string | null) => void
  panelOpen:        boolean
  activeSection:    SectionKey | null
  musicPlaying:     boolean
  onMusicToggle:    () => void
<<<<<<< HEAD
=======
=======
  onSelect:      (section: SectionKey) => void
  onProgress:    (p: number) => void
  onLoaded:      () => void
  onLockChange:  (locked: boolean) => void
  onHover:       (label: string | null, color: string | null) => void
  controlMode:   'orbit' | 'wasd'
  pointerLocked: boolean
  wasdRef:       RefObject<WasdControlsHandle | null>
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
}

export function Scene({
  onSelect, onProgress, onLoaded, onLockChange, onHover,
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
  controlMode, pointerLocked, wasdRef, inhibitLockRef,
  zoomedBoardId, onBoardZoom, panelOpen, activeSection,
  musicPlaying, onMusicToggle,
}: SceneProps) {
  const wasdLocked = controlMode === 'wasd' && pointerLocked
  const [hoveredSection, setHoveredSection] = useState<SectionKey | null>(null)
  const [returning, setReturning]           = useState(false)
  const handleSectionHover = useCallback((section: SectionKey, h: boolean) => {
    setHoveredSection(h ? section : null)
  }, [])

  // Necesario para que rectAreaLight funcione con MeshStandardMaterial
  useEffect(() => { RectAreaLightUniformsLib.init() }, [])
<<<<<<< HEAD
=======
=======
  controlMode, pointerLocked, wasdRef,
}: SceneProps) {
  const wasdLocked = controlMode === 'wasd' && pointerLocked
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0

  return (
    <>
      <ProgressBridge onProgress={onProgress} onLoaded={onLoaded} />
      <color attach="background" args={['#303575']} />

      <Suspense fallback={null}>
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
        {/* Luz ambiental tenue — la ventana es la fuente principal */}
        <ambientLight intensity={0.35} color="#c8d8ff" />

        {/* Sol — directionalLight */}
        <directionalLight
          position={[-3, 5, -6]} intensity={0} color="#fff8e8" castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.5} shadow-camera-far={30}
          shadow-camera-left={-8} shadow-camera-right={8}
          shadow-camera-top={8}   shadow-camera-bottom={-8}
        />
        <LightMarker position={[-3, 5, -6]} color="#fff8e8" label="directional (sol)" />

        {/* Halo ventana — pointLight */}
        <pointLight position={[-1.8, 2.2, -2.8]} intensity={0} color="#fff4d0" distance={6} decay={2} />
        <LightMarker position={[-1.8, 2.2, -2.8]} color="#fff4d0" label="point (halo ventana)" />

        {/* Relleno opuesto — pointLight */}
        <pointLight position={[3.5, 2.5, 2]} intensity={0} color="#b0c8ff" distance={9} decay={2} />
        <LightMarker position={[3.5, 2.5, 2]} color="#b0c8ff" label="point (relleno)" />

        {/* Monitor — rectAreaLight */}
        <rectAreaLight width={1.5} height={1.2} color="#fff0c0" intensity={10}
          position={[-0.6, 2.4, -3.7]} rotation={[0, Math.PI, 0]} />
        <LightMarker position={[-0.6, 2.4, -3.7]} color="#fff0c0" label="rectArea (monitor)" />

        {/* Ventana — spotLight */}
        <spotLight
          position={[-9, 6.5, -2]}
          angle={1} penumbra={2} intensity={1500} color="#f17339"
          distance={20} decay={2} castShadow shadow-mapSize={[512, 512]}
        />
        <LightMarker position={[-9, 6.5, -2]} color="#ff9456 " label="spot (ventana)" />

        <Environment preset="apartment" resolution={128} />
<<<<<<< HEAD
=======
=======
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[4, 8, 4]} intensity={1.2} castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.1} shadow-camera-far={50}
          shadow-camera-left={-10} shadow-camera-right={10}
          shadow-camera-top={10}  shadow-camera-bottom={-10}
        />
        <pointLight position={[-4, 3, -4]} intensity={0.4} color="#a78bfa" />
        <pointLight position={[4, 2, 4]}   intensity={0.3} color="#38bdf8" />

        <Environment preset="apartment" />
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
        <Room />

        {INTERACTIVE_OBJECTS.map((obj) => (
          <InteractiveModel
            key={obj.id}
            config={obj}
            onSelect={onSelect}
            wasdLocked={wasdLocked}
            onHover={onHover}
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
            isActive={activeSection === obj.section && !!obj.zoomCamOffset}
            panelOpen={panelOpen}
            sectionHovered={hoveredSection === obj.section}
            onHoverChange={handleSectionHover}
<<<<<<< HEAD
=======
=======
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
          />
        ))}
        {DECORATIVE_MODELS.map((path) => (
          <DecorativeModel key={path} path={path} />
        ))}
        <Clouds />
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0

        <Character
          onSelect={onSelect}
          onHover={onHover}
          wasdLocked={wasdLocked}
          panelOpen={panelOpen}
        />

        <Fred wasdLocked={wasdLocked} />
        <Altavoces wasdLocked={wasdLocked} onHover={onHover} panelOpen={panelOpen || zoomedBoardId !== null} playing={musicPlaying} onToggle={onMusicToggle} />

        <TableroDibujos
          id="tablon"
          modelPath="/tablon_dibujos.glb"
          label="Arte"
          panelOpen={panelOpen}
          needleHeight={BOARD_NEEDLE_HEIGHTS['tablon']}
          onHover={onHover}
          wasdLocked={wasdLocked}
          zoomedBoardId={zoomedBoardId}
          onBoardZoom={onBoardZoom}
        />

        <TableroDibujos
          id="tablet"
          modelPath="/tablet.glb"
          label="CV"
          panelOpen={panelOpen}
          needleHeight={BOARD_NEEDLE_HEIGHTS['tablet']}
          onHover={onHover}
          wasdLocked={wasdLocked}
          zoomedBoardId={zoomedBoardId}
          onBoardZoom={onBoardZoom}
        />

      </Suspense>

      {/* Controles */}
      {(() => {
        const hasObjZoom = INTERACTIVE_OBJECTS.some(
          o => o.section === activeSection && !!o.zoomCamOffset
        )
        const isZooming = hasObjZoom || zoomedBoardId !== null

        if (controlMode === 'orbit') {
          return (
            <>
              <CameraZoomReturn isZooming={isZooming} onReturning={setReturning} />
              {!isZooming && !returning && (
                <OrbitControls
                  target={[0, 0.7, 0]}
                  minPolarAngle={0.1}
                  maxPolarAngle={Math.PI * 0.68}
                  enablePan={false}
                  maxDistance={13}
                  minDistance={1.2}
                  autoRotate={!panelOpen}
                  autoRotateSpeed={0.35}
                  enableDamping
                  dampingFactor={0.07}
                />
              )}
            </>
          )
        }

        return (
          <>
            <CameraZoomReturn isZooming={isZooming} />
            <WasdControls ref={wasdRef} onLockChange={onLockChange} inhibitLockRef={inhibitLockRef} />
          </>
        )
      })()}
    </>
  )
}

// Preload prioritario — modelos que tienen zoom/animación para evitar tirones
INTERACTIVE_OBJECTS.forEach(o => useGLTF.preload(o.modelPath))
DECORATIVE_MODELS.forEach(p => useGLTF.preload(p))
useGLTF.preload('/tablon_dibujos.glb')
useGLTF.preload('/tablet.glb')
useGLTF.preload('/habitacion.glb')
useGLTF.preload('/altavoces.glb')
useGLTF.preload('/ra_tiping.glb')
<<<<<<< HEAD
=======
=======
      </Suspense>

      {controlMode === 'orbit' ? (
        <OrbitControls
          target={[0, 0.7, 0]}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI * 0.68}
          enablePan={false}
          maxDistance={13}
          minDistance={1.2}
          autoRotate
          autoRotateSpeed={0.35}
          enableDamping
          dampingFactor={0.07}
        />
      ) : (
        <WasdControls ref={wasdRef} onLockChange={onLockChange} />
      )}
    </>
  )
}
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
