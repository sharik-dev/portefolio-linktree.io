import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy pour les images freepik (bloquées par CORS dans WebGL)
      '/img-proxy/freepik': {
        target: 'https://img.freepik.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-proxy\/freepik/, ''),
      },
      '/img-proxy/flaticon': {
        target: 'https://cdn-icons-png.flaticon.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-proxy\/flaticon/, ''),
      },
    },
  },
})

