import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [
    tailwindcss(),
    react({
      babel: {
        browserslistConfigFile: false,
      },
    }),
  ],
  assetsInclude: ['**/*.md', '**/*.glb'],
  server: {
    proxy: {
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
