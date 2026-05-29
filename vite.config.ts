import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // Serve GLB files from Habitación/ at the root URL (e.g. /habitacion.glb)
  publicDir: path.join(__dirname, 'Habitación'),
})
