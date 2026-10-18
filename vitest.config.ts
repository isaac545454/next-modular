import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/app': path.resolve(rootDir, 'src/app'),
      '@/modules': path.resolve(rootDir, 'src/app/modules'),
      '@/shared': path.resolve(rootDir, 'src/shared'),
      '@/test': path.resolve(rootDir, 'src/test'),
      'next/link': path.resolve(rootDir, 'src/test/next-link.tsx'),
      'next/navigation': path.resolve(rootDir, 'src/test/next-navigation.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    restoreMocks: true,
    clearMocks: true,
  },
})
