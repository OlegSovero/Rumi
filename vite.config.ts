import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy a Ollama local para evitar CORS desde el navegador.
// La app llama a /api/ollama/* → http://127.0.0.1:11434/*
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/ollama': {
        target: 'http://127.0.0.1:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ollama/, ''),
      },
    },
  },
})
