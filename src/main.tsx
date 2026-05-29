import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
import { useGLTF } from '@react-three/drei'
import './index.css'
import App from './App'

// Decodificador Draco para modelos GLB comprimidos con Draco
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

<<<<<<< HEAD
=======
=======
import './index.css'
import App from './App'

>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
>>>>>>> 969773ecc47a4948f09847e7f2e914bb59d413b0
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
