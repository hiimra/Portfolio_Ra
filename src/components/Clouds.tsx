import { useGLTF } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CLOUD_CONFIGS } from '../data/portfolio'

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
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
<<<<<<< HEAD
=======
=======
const SWING = 2.5   // amplitud del vaivén lateral (±units)

function Cloud({ path, phase, yBase }: { path: string; phase: number; yBase: number }) {
  const { scene } = useGLTF(path)
  // Clonar para que cada nube tenga su propio Object3D independiente
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
  const cloned = useMemo(() => scene.clone(true), [scene])
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
    ref.current.position.x = xBase + Math.sin(t * 0.10 + phase) * SWING_X
    ref.current.position.y = yBase + Math.sin(t * 0.22 + phase) * SWING_Y
    // z fijo — la nube se balancea solo en x/y
  })

  return (
    <group ref={ref} position={[xBase, yBase, zBase]}>
<<<<<<< HEAD
=======
=======
    // Vaivén suave izquierda–derecha (seno = ida y vuelta sin salto)
    ref.current.position.x = Math.sin(t * 0.12 + phase) * SWING
    // Flotación vertical suave encima de su altura base
    ref.current.position.y = yBase + Math.sin(t * 0.35 + phase) * 0.15
  })

  return (
    // position inicial = yBase para que no aparezca en y=0 el primer frame
    <group ref={ref} position={[0, yBase, 0]}>
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
      <primitive object={cloned} />
    </group>
  )
}

export function Clouds() {
  return (
    <>
      {CLOUD_CONFIGS.map((c) => (
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
        <Cloud
          key={c.path}
          path={c.path}
          phase={c.phase}
          xBase={c.xBase}
          yBase={c.yBase}
          zBase={c.zBase}
        />
<<<<<<< HEAD
=======
=======
        <Cloud key={c.path} path={c.path} phase={c.phase} yBase={c.yBase} />
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
      ))}
    </>
  )
}
