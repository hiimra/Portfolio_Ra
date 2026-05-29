import { useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SOUND_SRC = '/freddy-honk.mp3'

interface Props {
  wasdLocked: boolean
}

export function Fred({ wasdLocked }: Props) {
  const { scene } = useGLTF('/Fred.glb')
  const groupRef  = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const audioRef  = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio(SOUND_SRC)
    audioRef.current.volume = 0.7
  }, [])

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

  useFrame(() => {
    if (!groupRef.current) return
    const target = hovered ? 1.05 : 1.0
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.1)
    )
  })

  return (
    <group
      ref={groupRef}
      scale={1}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch(() => {})
        }
      }}
    >
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/Fred.glb')
