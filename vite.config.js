import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { learningContent } from './scripts/content/vite-plugin.mjs'

export default defineConfig(({ mode }) => ({
  plugins: [learningContent(), react()],
  ...(mode === 'drafts' ? { server: { host: '127.0.0.1' } } : {}),
}))
