import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // In dev, forward /api calls to Spring Boot so there is no CORS to deal with.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  build: {
    // Write the production build straight into Spring Boot's static resources
    // so `mvn package` produces one self-contained jar.
    outDir: '../target/classes/static',
    emptyOutDir: true,
  },
})
