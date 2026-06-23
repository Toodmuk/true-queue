import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // relative base → the built bundle works at a domain root (Vercel) AND under a
  // project subpath (GitHub Pages: /true-experience/). The app has no router, so
  // relative asset URLs are all we need.
  base: './',
  plugins: [react(), tailwindcss()],
})
