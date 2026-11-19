import { defineConfig } from 'vitest/config';

// La web se publica en djl.com.es/factura/, de ahí la base.
export default defineConfig({
  base: '/factura/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
