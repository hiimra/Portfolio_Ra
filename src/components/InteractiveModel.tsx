import { useGLTF, Html } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { InteractiveObjectConfig, SectionKey } from '../data/portfolio'
import { SECTION_COLORS } from '../data/portfolio'

const DEFAULT_NEEDLE_H = 0.58

interface Props {
  config: InteractiveObjectConfig
  onSelect: (section: SectionKey) => void
  wasdLocked: boolean
  onHover: (label: string | null, color: string | null) => void
  isActive?: boolean
  panelOpen?: boolean
  sectionHovered?: boolean
  onHoverChange?: (section: SectionKey, hovered: boolean) => void
}

function IndicatorRing({
  color,
  ringPos,
  hovered,
}: {
  color: string
  ringPos: [number, number, number]
  hovered: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshBasicMaterial
    const base = hovered ? 0.70 : 0.32
    mat.opacity = base + Math.sin(state.clock.elapsedTime * 3) * 0.15
    const targetScale = hovered ? 1.3 : 1.0
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
    meshRef.current.scale.setScalar(s)
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={ringPos}>
      <ringGeometry args={[0.1, 0.2, 48]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

export function InteractiveModel({ config, onSelect, wasdLocked, onHover, isActive, panelOpen, sectionHovered, onHoverChange }: Props) {
  const { scene }  = useGLTF(config.modelPath)
  const { camera } = useThree()
  const groupRef   = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [ringPos, setRingPos] = useState<[number, number, number] | null>(null)
  const color = SECTION_COLORS[config.section]

  const zoomCenter = useRef(new THREE.Vector3())
  const zoomTarget = useRef(new THREE.Vector3())
  const zoomReady  = useRef(false)
  const zoomFrames = useRef(0)

  useEffect(() => {
    zoomReady.current  = false
    zoomFrames.current = 0
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    const box = new THREE.Box3().setFromObject(scene)
    const center = new THREE.Vector3()
    box.getCenter(center)
    setRingPos([center.x, box.min.y + 0.015, center.z])
  }, [scene])

  useEffect(() => {
    if (!isActive) {
      zoomReady.current  = false
      zoomFrames.current = 0
    }
  }, [isActive])

  useEffect(() => {
    if (wasdLocked) return
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered, wasdLocked])

  useEffect(() => {
    onHover(hovered ? config.label : null, hovered ? color : null)
  }, [hovered, config.label, color, onHover])

  useEffect(() => { return () => { onHover(null, null) } }, [onHover])

  useFrame(() => {
    if (!groupRef.current) return

    const anyH = hovered || (sectionHovered ?? false)
    const scaleTarget = anyH ? 1.04 : 1.0
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, scaleTarget, 0.1)
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, scaleTarget, 0.1)
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, scaleTarget, 0.1)

    if (!config.zoomCamOffset || !isActive) return

    zoomFrames.current++
    if (!zoomReady.current && zoomFrames.current > 3) {
      groupRef.current.updateWorldMatrix(true, true)
      const box = new THREE.Box3().setFromObject(groupRef.current)
      if (!box.isEmpty()) {
        box.getCenter(zoomCenter.current)
        const off   = config.zoomCamOffset
        const angle = ((config.zoomCamAngle ?? 0) * Math.PI) / 180
        const cosA  = Math.cos(angle)
        const sinA  = Math.sin(angle)
        zoomTarget.current.set(
          zoomCenter.current.x + off[0] * cosA + off[2] * sinA,
          zoomCenter.current.y + off[1],
          zoomCenter.current.z - off[0] * sinA + off[2] * cosA,
        )
        const look = config.zoomLookOffset ?? [0, 0, 0]
        zoomCenter.current.set(
          zoomCenter.current.x + look[0],
          zoomCenter.current.y + look[1],
          zoomCenter.current.z + look[2],
        )
        zoomReady.current = true
      }
    }
    if (!zoomReady.current) return
    camera.position.lerp(zoomTarget.current, 0.05)
    camera.lookAt(zoomCenter.current)
  })

  const needleH   = config.needleHeight ?? DEFAULT_NEEDLE_H
  const showLabel = !config.hideLabel && !panelOpen && ringPos !== null
  const anyHovered = hovered || (sectionHovered ?? false)

  return (
    <group
      ref={groupRef}
      position={config.position}
      rotation={config.rotation}
      scale={config.scale}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHoverChange?.(config.section, true) }}
      onPointerOut={() => { setHovered(false); onHoverChange?.(config.section, false) }}
      onClick={(e) => {
        e.stopPropagation()
        if (wasdLocked) document.exitPointerLock()
        onSelect(config.section)
      }}
    >
      <primitive object={scene} />

      {ringPos && (
        <IndicatorRing color={color} ringPos={ringPos} hovered={anyHovered} />
      )}

      {/* Glow point at ring base */}
      {ringPos && (
        <pointLight
          color={color}
          intensity={anyHovered ? 1.5 : 0.45}
          distance={anyHovered ? 1.8 : 1.3}
          decay={2}
          position={[ringPos[0], ringPos[1] + 0.5, ringPos[2]]}
        />
      )}

      {/* Needle from ring center upward */}
      {showLabel && ringPos && (
        <mesh
          position={[ringPos[0], ringPos[1] + needleH / 2, ringPos[2]]}
          renderOrder={1}
        >
          <cylinderGeometry args={[0.007, 0.007, needleH, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={anyHovered ? 0.85 : 0.5}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Label at top of needle */}
      {showLabel && ringPos && (
        <Html
          position={[ringPos[0], ringPos[1] + needleH + 0.06, ringPos[2]]}
          center
          distanceFactor={10}
          zIndexRange={[15, 0]}
        >
          <div
            className={`float-label ${anyHovered ? 'float-label--hovered' : ''}`}
            style={{ '--label-color': color } as React.CSSProperties}
          >
            {config.label}
          </div>
        </Html>
      )}
    </group>
  )
}
