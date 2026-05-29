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
<<<<<<< HEAD
        child.castShadow = false   // decorativos no proyectan sombras
        child.receiveShadow = true // sí reciben (para verse bien sobre el suelo)
=======
        child.castShadow = true
        child.receiveShadow = true
>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
      }
    })
  }, [scene])

  return <primitive object={scene} />
}
