import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'node', // crypto berjalan di Node, bukan browser
    env: {
      // Kunci sintetis untuk keperluan uji — BUKAN kunci produksi
      ENCRYPTION_KEY: 'kunci-test-32-karakter-sintetis!', // tepat 32 karakter
      HMAC_SECRET: 'hmac-secret-sintetis-untuk-testing',
    },
  },
})
