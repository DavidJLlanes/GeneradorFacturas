import { defineConfig } from 'vitest/config';
import { pwaPlugin } from './src/pwa/pwa-plugin';

const BASE = '/factura/';

// La web se publica en djl.com.es/factura/, de ahí la base.
export default defineConfig({
  base: BASE,
  plugins: [pwaPlugin(BASE)],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
