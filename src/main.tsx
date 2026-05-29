import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
import { useGLTF } from '@react-three/drei'
import './index.css'
import App from './App'

// Decodificador Draco para modelos GLB comprimidos con Draco
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

=======
import './index.css'
import App from './App'

>>>>>>> c904297cc220a961688a51e77114a696c0cab63c
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
