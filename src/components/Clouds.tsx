import { useGLTF } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CLOUD_CONFIGS } from '../data/portfolio'

const SWING = 2.5   // amplitud del vaivén lateral (±units)

function Cloud({ path, phase, yBase }: { path: string; phase: number; yBase: number }) {
  const { scene } = useGLTF(path)
  // Clonar para que cada nube tenga su propio Object3D independiente
  const cloned = useMemo(() => scene.clone(true), [scene])
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    // Vaivén suave izquierda–derecha (seno = ida y vuelta sin salto)
    ref.current.position.x = Math.sin(t * 0.12 + phase) * SWING
    // Flotación vertical suave encima de su altura base
    ref.current.position.y = yBase + Math.sin(t * 0.35 + phase) * 0.15
  })

  return (
    // position inicial = yBase para que no aparezca en y=0 el primer frame
    <group ref={ref} position={[0, yBase, 0]}>
      <primitive object={cloned} />
    </group>
  )
}

export function Clouds() {
  return (
    <>
      {CLOUD_CONFIGS.map((c) => (
        <Cloud key={c.path} path={c.path} phase={c.phase} yBase={c.yBase} />
      ))}
    </>
  )
}
