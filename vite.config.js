import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/world-cup-quiz/' : '/',
  server: {
    port: parseInt(process.env.PORT || '5173'),
    strictPort: false,
  },
})
