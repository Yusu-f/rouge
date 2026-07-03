import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/rouge/',
  plugins: [react(), tailwindcss()],
  server: { port: 4290, strictPort: true },
})
