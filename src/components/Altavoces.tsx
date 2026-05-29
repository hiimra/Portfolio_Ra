import { useGLTF, Html } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MUSIC_COLOR = '#a855f7'
const NEEDLE_H    = 0.7

interface Props {
  wasdLocked: boolean
  onHover:    (label: string | null, color: string | null) => void
  panelOpen?: boolean
  playing:    boolean
  onToggle:   () => void
}

export function Altavoces({ wasdLocked, onHover, panelOpen, playing, onToggle }: Props) {
  const { scene } = useGLTF('/altavoces.glb')
  const [hovered, setHovered] = useState(false)
  const [ringPos, setRingPos] = useState<[number, number, number] | null>(null)

  const glowRef       = useRef<THREE.PointLight>(null)
  const ringRef       = useRef<THREE.Mesh>(null)
  const boundComputed = useRef(false)
  const frameCount    = useRef(0)
  const groupRef      = useRef<THREE.Group>(null)

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  useEffect(() => {
    if (wasdLocked) return
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered, wasdLocked])

  useEffect(() => {
    onHover(hovered ? '♪ Música' : null, hovered ? MUSIC_COLOR : null)
  }, [hovered, onHover])

  useEffect(() => { return () => { onHover(null, null) } }, [onHover])

  useFrame((state) => {
    frameCount.current++
    if (!boundComputed.current && groupRef.current && frameCount.current > 3) {
      groupRef.current.updateWorldMatrix(true, true)
      const box = new THREE.Box3().setFromObject(groupRef.current)
      if (!box.isEmpty()) {
        const center = new THREE.Vector3()
        box.getCenter(center)
        setRingPos([center.x + 1.05, box.min.y + 0.015, center.z])
        boundComputed.current = true
      }
    }

    if (glowRef.current) {
      glowRef.current.intensity = playing
        ? 0.7 + Math.sin(state.clock.elapsedTime * 1.8) * 0.35
        : 0
    }

    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial
      const base = (hovered || playing) ? 0.70 : 0.32
      mat.opacity = base + Math.sin(state.clock.elapsedTime * 3) * 0.15
      const targetScale = (hovered || playing) ? 1.3 : 1.0
      const s = THREE.MathUtils.lerp(ringRef.current.scale.x, targetScale, 0.1)
      ringRef.current.scale.setScalar(s)
    }
  })

  const showLabel = !panelOpen && ringPos !== null

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onToggle() }}
    >
      <primitive object={scene} />

      <pointLight ref={glowRef} color={MUSIC_COLOR} intensity={0} distance={3} decay={2} position={[0, 0.6, 0]} />

      {ringPos && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={ringPos}>
          <ringGeometry args={[0.1, 0.2, 48]} />
          <meshBasicMaterial color={MUSIC_COLOR} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}

      {ringPos && (
        <pointLight
          color={MUSIC_COLOR}
          intensity={(hovered || playing) ? 1.2 : 0.35}
          distance={1.5}
          decay={2}
          position={[ringPos[0], ringPos[1] + 0.5, ringPos[2]]}
        />
      )}

      {showLabel && ringPos && (
        <mesh position={[ringPos[0], ringPos[1] + NEEDLE_H / 2, ringPos[2]]} renderOrder={1}>
          <cylinderGeometry args={[0.007, 0.007, NEEDLE_H, 6]} />
          <meshBasicMaterial
            color={MUSIC_COLOR}
            transparent
            opacity={(hovered || playing) ? 0.85 : 0.5}
            depthWrite={false}
          />
        </mesh>
      )}

      {showLabel && ringPos && (
        <Html
          position={[ringPos[0], ringPos[1] + NEEDLE_H + 0.06, ringPos[2]]}
          center
          distanceFactor={10}
          zIndexRange={[15, 0]}
        >
          <div
            className={`float-label ${(hovered || playing) ? 'float-label--hovered' : ''}`}
            style={{ '--label-color': MUSIC_COLOR } as React.CSSProperties}
          >
            <span style={{ textDecoration: playing ? 'none' : 'line-through', textDecorationThickness: '2px', fontSize: '18px' }}>
              ♫
            </span>
          </div>
        </Html>
      )}
    </group>
  )
}

useGLTF.preload('/altavoces.glb')
