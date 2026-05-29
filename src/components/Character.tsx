import { useGLTF, useAnimations, Html } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SECTION_COLORS, type SectionKey } from '../data/portfolio'

const BASE_SCALE = 3.2
const POSITION: [number, number, number] = [-0.85, 0.60, -1.7]
const ROTATION: [number, number, number] = [0, Math.PI, 0]

const NEEDLE_H = 0.9  // local units (×3.2 scale ≈ 1.5 world units)

function IndicatorRing({ color, ringPos, hovered }: { color: string; ringPos: [number, number, number]; hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshBasicMaterial
    const base = hovered ? 0.70 : 0.32
    mat.opacity = base + Math.sin(state.clock.elapsedTime * 3) * 0.15
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, hovered ? 1.3 : 1.0, 0.1)
    meshRef.current.scale.setScalar(s)
  })
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={ringPos}>
      <ringGeometry args={[0.1, 0.2, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

interface Props {
  onSelect:   (section: SectionKey) => void
  onHover:    (label: string | null, color: string | null) => void
  wasdLocked: boolean
  panelOpen?: boolean
}

export function Character({ onSelect, onHover, wasdLocked, panelOpen }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/ra_tiping.glb')
  const { actions, names } = useAnimations(animations, groupRef)
  const [hovered, setHovered] = useState(false)
  const [ringPos, setRingPos] = useState<[number, number, number] | null>(null)
  const color = SECTION_COLORS['about']

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  // Calcula ringPos en espacio mundo tras montar el grupo para que la escala/offset no la desplacen
  useEffect(() => {
    const id = setTimeout(() => {
      if (!groupRef.current) return
      groupRef.current.updateWorldMatrix(true, true)
      const box = new THREE.Box3().setFromObject(groupRef.current)
      const worldCenter = new THREE.Vector3()
      box.getCenter(worldCenter)
      // Convierte el punto mundo (centro XZ, suelo Y) a espacio local del grupo
      const localPos = groupRef.current.worldToLocal(
        new THREE.Vector3(worldCenter.x, box.min.y + 0.015, worldCenter.z + 0.25)
      )
      setRingPos([localPos.x, localPos.y, localPos.z])
    }, 80)
    return () => clearTimeout(id)
  }, [scene])

  useEffect(() => {
    if (names.length === 0) return
    const anim = actions[names[0]]
    if (!anim) return
    anim.reset()
    anim.setLoop(THREE.LoopRepeat, Infinity)
    anim.fadeIn(0.4).play()
    return () => { anim.fadeOut(0.3) }
  }, [actions, names])

  useEffect(() => {
    if (wasdLocked) return
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered, wasdLocked])

  useEffect(() => {
    onHover(hovered ? 'Sobre Mí' : null, hovered ? color : null)
  }, [hovered, color, onHover])

  useEffect(() => {
    return () => { onHover(null, null) }
  }, [onHover])

  useFrame(() => {
    if (!groupRef.current) return
    const target = hovered ? BASE_SCALE * 1.04 : BASE_SCALE
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.1)
    )
  })

  return (
    <group
      ref={groupRef}
      position={POSITION}
      rotation={ROTATION}
      scale={BASE_SCALE}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        if (wasdLocked) document.exitPointerLock()
        onSelect('about')
      }}
    >
      <primitive object={scene} />

      {ringPos && <IndicatorRing color={color} ringPos={ringPos} hovered={hovered} />}

      {ringPos && (
        <pointLight
          color={color}
          intensity={hovered ? 1.5 : 0.45}
          distance={hovered ? 1.8 : 1.3}
          decay={2}
          position={[ringPos[0], ringPos[1] + 0.5, ringPos[2]]}
        />
      )}

      {ringPos && !panelOpen && (
        <mesh position={[ringPos[0], ringPos[1] + NEEDLE_H / 2, ringPos[2]]} renderOrder={1}>
          <cylinderGeometry args={[0.002, 0.002, NEEDLE_H, 6]} />
          <meshBasicMaterial color={color} transparent opacity={hovered ? 0.85 : 0.5} depthWrite={false} />
        </mesh>
      )}

      {ringPos && !panelOpen && (
        <Html
          position={[ringPos[0], ringPos[1] + NEEDLE_H + 0.06, ringPos[2]]}
          center
          distanceFactor={10}
          zIndexRange={[15, 0]}
        >
          <div
            className={`float-label ${hovered ? 'float-label--hovered' : ''}`}
            style={{ '--label-color': color } as React.CSSProperties}
          >
            Sobre Mí
          </div>
        </Html>
      )}
    </group>
  )
}

useGLTF.preload('/ra_tiping.glb')
