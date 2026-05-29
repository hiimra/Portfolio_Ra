import { useGLTF } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CLOUD_CONFIGS } from '../data/portfolio'

const SWING_X = 0.35  // oscilación lateral suave (±units)
const SWING_Y = 0.12  // flotación vertical suave

interface CloudProps {
  path:   string
  phase:  number
  xBase:  number
  yBase:  number
  zBase:  number
}

function Cloud({ path, phase, xBase, yBase, zBase }: CloudProps) {
  const { scene } = useGLTF(path)
  const cloned = useMemo(() => scene.clone(true), [scene])
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.x = xBase + Math.sin(t * 0.10 + phase) * SWING_X
    ref.current.position.y = yBase + Math.sin(t * 0.22 + phase) * SWING_Y
    // z fijo — la nube se balancea solo en x/y
  })

  return (
    <group ref={ref} position={[xBase, yBase, zBase]}>
      <primitive object={cloned} />
    </group>
  )
}

export function Clouds() {
  return (
    <>
      {CLOUD_CONFIGS.map((c) => (
        <Cloud
          key={c.path}
          path={c.path}
          phase={c.phase}
          xBase={c.xBase}
          yBase={c.yBase}
          zBase={c.zBase}
        />
      ))}
    </>
  )
}
