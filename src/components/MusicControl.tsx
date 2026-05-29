import { Html } from '@react-three/drei'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COLOR    = '#a78bfa'
const NEEDLE_H = 0.72

interface Props {
  playing:    boolean
  onToggle:   () => void
  wasdLocked: boolean
  panelOpen:  boolean
  position?:  [number, number, number]
}

function Ring({ hovered, playing }: { hovered: boolean; playing: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.MeshBasicMaterial
    const base = (hovered || playing) ? 0.70 : 0.32
    mat.opacity = base + Math.sin(state.clock.elapsedTime * 3) * 0.15
    const targetScale = (hovered || playing) ? 1.3 : 1.0
    const s = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.1)
    ref.current.scale.setScalar(s)
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
      <ringGeometry args={[0.14, 0.22, 48]} />
      <meshBasicMaterial color={COLOR} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

export function MusicControl({
  playing, onToggle, wasdLocked, panelOpen,
  position = [3.0, 0, 2.0],
}: Props) {
  const [hovered, setHovered] = useState(false)
  const discRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!discRef.current) return
    if (playing) discRef.current.rotation.y += 0.018
  })

  return (
    <group
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={(e) => {
        e.stopPropagation()
        if (wasdLocked) document.exitPointerLock()
        onToggle()
      }}
    >
      {/* Disco */}
      <mesh ref={discRef} position={[0, 0.013, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.025, 32]} />
        <meshStandardMaterial
          color="#08081c"
          emissive={COLOR}
          emissiveIntensity={playing ? 0.55 : (hovered ? 0.25 : 0.08)}
          roughness={0.25}
          metalness={0.85}
        />
      </mesh>

      {/* Surco central del disco */}
      <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.09, 32]} />
        <meshBasicMaterial color={COLOR} transparent opacity={playing ? 0.45 : 0.15} depthWrite={false} />
      </mesh>

      <Ring hovered={hovered} playing={playing} />

      <pointLight
        color={COLOR}
        intensity={playing ? 1.0 : (hovered ? 0.55 : 0.22)}
        distance={1.6}
        decay={2}
        position={[0, 0.5, 0]}
      />

      {/* Aguja */}
      {!panelOpen && (
        <mesh position={[0, 0.015 + NEEDLE_H / 2, 0]} renderOrder={1}>
          <cylinderGeometry args={[0.007, 0.007, NEEDLE_H, 6]} />
          <meshBasicMaterial
            color={COLOR}
            transparent
            opacity={(hovered || playing) ? 0.85 : 0.5}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Etiqueta flotante con nota musical */}
      {!panelOpen && (
        <Html
          position={[0, 0.015 + NEEDLE_H + 0.06, 0]}
          center
          distanceFactor={10}
          zIndexRange={[15, 0]}
        >
          <div
            className={`float-label ${hovered ? 'float-label--hovered' : ''}`}
            style={{ '--label-color': COLOR } as React.CSSProperties}
          >
            <span style={{
              textDecoration: playing ? 'none' : 'line-through',
              textDecorationThickness: '2px',
            }}>
              ♫
            </span>
          </div>
        </Html>
      )}
    </group>
  )
}
