import { PointerLockControls } from '@react-three/drei'
import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const SPEED  = 3.5
const SPRINT = 2.0

export interface WasdControlsHandle {
  startVertical: (dir: 1 | -1) => void
  stopVertical:  () => void
}

interface Props {
  onLockChange: (locked: boolean) => void
}

export const WasdControls = forwardRef<WasdControlsHandle, Props>(({ onLockChange }, ref) => {
  const { camera } = useThree()
  const keys        = useRef(new Set<string>())
  const verticalDir = useRef(0)

  useImperativeHandle(ref, () => ({
    startVertical: (dir) => { verticalDir.current = dir },
    stopVertical:  ()    => { verticalDir.current = 0 },
  }))

  useEffect(() => {
    const down = (e: KeyboardEvent) => keys.current.add(e.code)
    const up   = (e: KeyboardEvent) => keys.current.delete(e.code)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup',   up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup',   up)
    }
  }, [])

  useFrame((_, delta) => {
    const k      = keys.current
    const sprint = k.has('ShiftLeft') || k.has('ShiftRight')
    const speed  = SPEED * (sprint ? SPRINT : 1) * delta

    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()

    const right = new THREE.Vector3()
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()

    if (k.has('KeyW') || k.has('ArrowUp'))    camera.position.addScaledVector(forward,  speed)
    if (k.has('KeyS') || k.has('ArrowDown'))  camera.position.addScaledVector(forward, -speed)
    if (k.has('KeyA') || k.has('ArrowLeft'))  camera.position.addScaledVector(right,   -speed)
    if (k.has('KeyD') || k.has('ArrowRight')) camera.position.addScaledVector(right,    speed)

    // Altura: Q sube, E baja + botones de la UI
    const keyV = (k.has('KeyQ') || k.has('Space') ? 1 : 0) - (k.has('KeyE') ? 1 : 0)
    const totalV = keyV + verticalDir.current
    if (totalV !== 0) camera.position.y += totalV * speed
  })

  return (
    <PointerLockControls
      onLock={()   => onLockChange(true)}
      onUnlock={() => onLockChange(false)}
      // Limita el pitch: evita pasar de vertical y el spin descontrolado
      minPolarAngle={Math.PI * 0.08}
      maxPolarAngle={Math.PI * 0.92}
      pointerSpeed={0.75}
    />
  )
})

WasdControls.displayName = 'WasdControls'
