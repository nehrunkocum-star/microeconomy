import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/microeconomy/',     // must match your repo name
  build: { outDir: 'docs' },  // build output goes to /docs (for GitHub Pages)
})

