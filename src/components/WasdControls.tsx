import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls as PLCImpl } from 'three/examples/jsm/controls/PointerLockControls.js'
import * as THREE from 'three'

const SPEED  = 3.5
const SPRINT = 2.0

export interface WasdControlsHandle {
  startVertical: (dir: 1 | -1) => void
  stopVertical:  () => void
  lock:          () => void
}

interface Props {
  onLockChange:   (locked: boolean) => void
  inhibitLockRef: React.MutableRefObject<boolean>
}

export const WasdControls = forwardRef<WasdControlsHandle, Props>(
  ({ onLockChange, inhibitLockRef }, ref) => {
    const { camera, gl, setEvents } = useThree()
    const keys        = useRef(new Set<string>())
    const verticalDir = useRef(0)
    const controlsRef = useRef<InstanceType<typeof PLCImpl> | null>(null)

    useImperativeHandle(ref, () => ({
      startVertical: (dir) => { verticalDir.current = dir },
      stopVertical:  ()    => { verticalDir.current = 0 },
      lock:          ()    => { controlsRef.current?.lock() },
    }))

    // Override R3F's pointer-position compute so that ALL pointer events
    // (click, pointerdown, pointerup, pointermove) raycast from screen center
    // when pointer lock is active. Without this, clientX/Y are frozen at the
    // position the cursor held when the lock was entered, causing missed hits.
    useEffect(() => {
      function standardCompute(event: MouseEvent | PointerEvent, state: { gl: { domElement: HTMLElement }; pointer: THREE.Vector2; raycaster: THREE.Raycaster; camera: THREE.Camera }) {
        const rect = state.gl.domElement.getBoundingClientRect()
        state.pointer.set(
          ((event.clientX - rect.left) / rect.width)  *  2 - 1,
          ((event.clientY - rect.top)  / rect.height) * -2 + 1,
        )
        state.raycaster.setFromCamera(state.pointer, state.camera)
      }

      setEvents({
        compute(event: MouseEvent | PointerEvent, state) {
          if (document.pointerLockElement) {
            state.pointer.set(0, 0)
          } else {
            standardCompute(event, state)
          }
          state.raycaster.setFromCamera(state.pointer, state.camera)
        },
      })
      // Restore standard NDC compute so orbit mode keeps working after unmount
      return () => setEvents({ compute: standardCompute as any })
    }, [setEvents])

    useEffect(() => {
      const controls = new PLCImpl(camera, gl.domElement)
      controls.minPolarAngle = Math.PI * 0.08
      controls.maxPolarAngle = Math.PI * 0.92
      controls.pointerSpeed  = 0.75
      controlsRef.current    = controls

      const onLock   = () => onLockChange(true)
      const onUnlock = () => { onLockChange(false); document.body.style.cursor = 'auto' }
      controls.addEventListener('lock',   onLock)
      controls.addEventListener('unlock', onUnlock)

      const handleClick = () => {
        if (inhibitLockRef.current) { inhibitLockRef.current = false; return }
        if (!controls.isLocked) controls.lock()
      }
      gl.domElement.addEventListener('click', handleClick)

      return () => {
        gl.domElement.removeEventListener('click', handleClick)
        controls.removeEventListener('lock',   onLock)
        controls.removeEventListener('unlock', onUnlock)
        controls.dispose()
        controlsRef.current = null
      }
    }, [camera, gl, onLockChange, inhibitLockRef])

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
      const locked = controlsRef.current?.isLocked
      if (!locked) return

      // Dispatch a synthetic pointermove at canvas center every frame so R3F
      // re-evaluates hover even when the camera moves without mouse movement.
      const canvas = gl.domElement
      const rect   = canvas.getBoundingClientRect()
      canvas.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true,
        clientX: rect.left + rect.width  / 2,
        clientY: rect.top  + rect.height / 2,
        pointerId: 1,
      }))

      // WASD movement
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

      const keyV   = (k.has('KeyQ') || k.has('Space') ? 1 : 0) - (k.has('KeyE') ? 1 : 0)
      const totalV = keyV + verticalDir.current
      if (totalV !== 0) camera.position.y += totalV * speed
    })

    return null
  }
)

WasdControls.displayName = 'WasdControls'
