import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/upload-video-with-txt': 'http://localhost:5000',
      '/upload-clip': 'http://localhost:5000',
      '/process-video': 'http://localhost:5000',
      '/download': 'http://localhost:5000',
      '/list-clips': 'http://localhost:5000'
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})

