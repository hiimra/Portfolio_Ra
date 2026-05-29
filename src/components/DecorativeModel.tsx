import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'

interface Props {
  path: string
}

export function DecorativeModel({ path }: Props) {
  const { scene } = useGLTF(path)

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false   // decorativos no proyectan sombras
        child.receiveShadow = true // sí reciben (para verse bien sobre el suelo)
      }
    })
  }, [scene])

  return <primitive object={scene} />
}
