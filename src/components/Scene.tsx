import { Suspense } from 'react'
import { OrbitControls, Environment, useProgress } from '@react-three/drei'
import { useEffect, type RefObject } from 'react'
import { Room } from './Room'
import { InteractiveModel } from './InteractiveModel'
import { DecorativeModel } from './DecorativeModel'
import { Clouds } from './Clouds'
import { WasdControls, type WasdControlsHandle } from './WasdControls'
import { INTERACTIVE_OBJECTS, DECORATIVE_MODELS, type SectionKey } from '../data/portfolio'

function ProgressBridge({ onProgress, onLoaded }: { onProgress: (p: number) => void; onLoaded: () => void }) {
  const { progress, active } = useProgress()
  useEffect(() => {
    onProgress(progress)
    if (!active && progress > 0) onLoaded()
  }, [progress, active, onProgress, onLoaded])
  return null
}

interface SceneProps {
  onSelect:      (section: SectionKey) => void
  onProgress:    (p: number) => void
  onLoaded:      () => void
  onLockChange:  (locked: boolean) => void
  onHover:       (label: string | null, color: string | null) => void
  controlMode:   'orbit' | 'wasd'
  pointerLocked: boolean
  wasdRef:       RefObject<WasdControlsHandle | null>
}

export function Scene({
  onSelect, onProgress, onLoaded, onLockChange, onHover,
  controlMode, pointerLocked, wasdRef,
}: SceneProps) {
  const wasdLocked = controlMode === 'wasd' && pointerLocked

  return (
    <>
      <ProgressBridge onProgress={onProgress} onLoaded={onLoaded} />
      <color attach="background" args={['#303575']} />

      <Suspense fallback={null}>
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
        <Room />

        {INTERACTIVE_OBJECTS.map((obj) => (
          <InteractiveModel
            key={obj.id}
            config={obj}
            onSelect={onSelect}
            wasdLocked={wasdLocked}
            onHover={onHover}
          />
        ))}
        {DECORATIVE_MODELS.map((path) => (
          <DecorativeModel key={path} path={path} />
        ))}
        <Clouds />
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
