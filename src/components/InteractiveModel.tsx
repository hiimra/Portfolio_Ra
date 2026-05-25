import { useGLTF, Html } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { InteractiveObjectConfig, SectionKey } from '../data/portfolio'
import { SECTION_COLORS } from '../data/portfolio'

interface Props {
  config: InteractiveObjectConfig
  onSelect: (section: SectionKey) => void
  /** En modo WASD bloqueado: oculta el Html flotante, reporta hover por callback */
  wasdLocked: boolean
  onHover: (label: string | null, color: string | null) => void
}

function IndicatorRing({ color, hovered }: { color: string; hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshBasicMaterial
    const base = hovered ? 0.9 : 0.45
    const amp  = hovered ? 0.1 : 0.25
    mat.opacity = base + Math.sin(state.clock.elapsedTime * 2.5) * amp
    const s = hovered
      ? THREE.MathUtils.lerp(meshRef.current.scale.x, 1.4, 0.1)
      : THREE.MathUtils.lerp(meshRef.current.scale.x, 1.0, 0.1)
    meshRef.current.scale.setScalar(s)
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <ringGeometry args={[0.12, 0.22, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

export function InteractiveModel({ config, onSelect, wasdLocked, onHover }: Props) {
  const { scene } = useGLTF(config.modelPath)
  const groupRef  = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const color = SECTION_COLORS[config.section]

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  // Cursor solo en modo órbita
  useEffect(() => {
    if (wasdLocked) return
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered, wasdLocked])

  // Al entrar/salir hover en modo WASD, notifica el label al overlay central
  useEffect(() => {
    if (!wasdLocked) return
    onHover(hovered ? config.label : null, hovered ? color : null)
  }, [hovered, wasdLocked, config.label, color, onHover])

  // Limpia el hover central al desmontar o cambiar de modo
  useEffect(() => {
    return () => { onHover(null, null) }
  }, [onHover])

  useFrame(() => {
    if (!groupRef.current) return
    const target = hovered ? 1.04 : 1.0
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.1)
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, target, 0.1)
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, target, 0.1)
  })

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        // En modo WASD, el click desbloquea el puntero Y abre el panel
        if (wasdLocked) document.exitPointerLock()
        onSelect(config.section)
      }}
    >
      <primitive object={scene} />
      <IndicatorRing color={color} hovered={hovered} />

      {hovered && (
        <pointLight color={color} intensity={1.5} distance={1.8} decay={2} position={[0, 0.5, 0]} />
      )}

      {/* Etiqueta flotante 3D solo en modo órbita */}
      {hovered && !wasdLocked && (
        <Html center distanceFactor={8} position={[0, 0.4, 0]} style={{ pointerEvents: 'none' }}>
          <div className="hover-label" style={{ '--label-color': color } as React.CSSProperties}>
            <span className="hover-label__icon">▶</span>
            {config.label}
          </div>
        </Html>
      )}
    </group>
  )
}
