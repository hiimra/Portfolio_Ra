import { useGLTF, Html } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SECTION_COLORS } from '../data/portfolio'

const COLOR            = SECTION_COLORS['contact']
const DEFAULT_NEEDLE_H = 2.1

// Offset de cámara relativo al centro de cada modelo (Z = distancia frontal)
const CAM_OFFSETS: Record<string, THREE.Vector3> = {
  tablon: new THREE.Vector3(0, 0.2, 2.1),
  tablet: new THREE.Vector3(0, 0.7, 0),  // cámara encima, vista cenital
}

// Offset del punto lookAt respecto al centro del bounding box
const LOOK_AT_OFFSETS: Record<string, THREE.Vector3> = {
  tablet: new THREE.Vector3(0, 0, 0),
}

export interface TableroDibujosProps {
  id:            string
  modelPath:     string
  onHover:       (label: string | null, color: string | null) => void
  wasdLocked:    boolean
  zoomedBoardId: string | null
  onBoardZoom:   (id: string | null) => void
  zoomTo?:       string
  label?:        string
  panelOpen?:    boolean
  needleHeight?: number
}

export function TableroDibujos({
  id, modelPath, onHover, wasdLocked, zoomedBoardId, onBoardZoom, zoomTo,
  label, panelOpen, needleHeight,
}: TableroDibujosProps) {
  const { scene }  = useGLTF(modelPath)
  const groupRef   = useRef<THREE.Group>(null)
  const ringRef    = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [ringPos, setRingPos] = useState<[number, number, number] | null>(null)
  const { camera } = useThree()

  const boardCenter   = useRef(new THREE.Vector3())
  const zoomTarget    = useRef(new THREE.Vector3())
  const camOffset     = useMemo(() => CAM_OFFSETS[id] ?? new THREE.Vector3(0, 0.2, 2.8), [id])
  const boundComputed = useRef(false)
  const frameCount    = useRef(0)

  const isMeZoomed = zoomedBoardId === id
  const needleH = needleHeight ?? DEFAULT_NEEDLE_H
  const showLabel  = !!label && !panelOpen && !isMeZoomed && ringPos !== null

  useEffect(() => {
    boundComputed.current = false
    frameCount.current = 0
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
    onHover(hovered ? (label ?? 'Tablón') : null, hovered ? COLOR : null)
  }, [hovered, label, onHover])

  useEffect(() => { return () => { onHover(null, null) } }, [onHover])

  useFrame((state) => {
    frameCount.current++
    if (!boundComputed.current && groupRef.current && frameCount.current > 3) {
      groupRef.current.updateWorldMatrix(true, true)
      const box = new THREE.Box3().setFromObject(groupRef.current)
      if (!box.isEmpty()) {
        const center = new THREE.Vector3()
        box.getCenter(center)
        setRingPos([center.x, box.min.y + 0.015, center.z])
        boardCenter.current.copy(center)
        const lookOffset = LOOK_AT_OFFSETS[id]
        if (lookOffset) boardCenter.current.add(lookOffset)
        zoomTarget.current.copy(boardCenter.current).add(camOffset)
        boundComputed.current = true
      }
    }

    // Animar anillo
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial
      const base = hovered ? 0.70 : 0.32
      mat.opacity = base + Math.sin(state.clock.elapsedTime * 3) * 0.15
      const targetScale = hovered ? 1.3 : 1.0
      const s = THREE.MathUtils.lerp(ringRef.current.scale.x, targetScale, 0.1)
      ringRef.current.scale.setScalar(s)
    }

    // FOV y up vector para tablet (vista cenital fija)
    const perspCam = camera as THREE.PerspectiveCamera
    if (id === 'tablet') {
      const targetFov = isMeZoomed ? 45 : 55
      if (Math.abs(perspCam.fov - targetFov) > 0.1) {
        perspCam.fov = THREE.MathUtils.lerp(perspCam.fov, targetFov, 0.06)
        perspCam.updateProjectionMatrix()
      }
      // up fijo: cenital con norte hacia -Z cuando zoom, restaurar a +Y al salir
      const targetUp = isMeZoomed
        ? new THREE.Vector3(-Math.sin(12 * Math.PI / 180), 0, -Math.cos(12 * Math.PI / 180))
        : new THREE.Vector3(0, 1, 0)
      camera.up.lerp(targetUp, 0.08)
    }

    if (!isMeZoomed) return
    camera.position.lerp(zoomTarget.current, 0.06)
    camera.lookAt(boardCenter.current)
  })

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        if (wasdLocked) document.exitPointerLock()
        onBoardZoom(zoomTo ?? id)
      }}
    >
      <primitive object={scene} />

      {/* Anillo siempre visible */}
      {ringPos && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={ringPos}>
          <ringGeometry args={[0.1, 0.2, 48]} />
          <meshBasicMaterial color={COLOR} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}

      {/* Glow */}
      {ringPos && (
        <pointLight
          color={COLOR}
          intensity={hovered ? 1.5 : 0.45}
          distance={hovered ? 1.8 : 1.3}
          decay={2}
          position={[ringPos[0], ringPos[1] + 0.5, ringPos[2]]}
        />
      )}

      {/* Aguja */}
      {showLabel && ringPos && (
        <mesh
          position={[ringPos[0], ringPos[1] + needleH / 2, ringPos[2]]}
          renderOrder={1}
        >
          <cylinderGeometry args={[0.007, 0.007, needleH, 6]} />
          <meshBasicMaterial
            color={COLOR}
            transparent
            opacity={hovered ? 0.85 : 0.5}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Etiqueta flotante */}
      {showLabel && ringPos && (
        <Html
          position={[ringPos[0], ringPos[1] + needleH + 0.06, ringPos[2]]}
          center
          distanceFactor={10}
          zIndexRange={[15, 0]}
        >
          <div
            className={`float-label ${hovered ? 'float-label--hovered' : ''}`}
            style={{ '--label-color': COLOR } as React.CSSProperties}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}
