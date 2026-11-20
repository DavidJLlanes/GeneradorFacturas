import type { Plugin } from 'vite';
import { serviceWorkerSource } from './service-worker-source';

// Archivos de `public/` que forman parte del núcleo sin conexión (Vite no los lista en el paquete).
const STATIC_FILES = [
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
];

// Al construir, añade `sw.js` con la lista de archivos de esta versión.
export function pwaPlugin(base: string): Plugin {
  return {
    name: 'generador-pwa',
    apply: 'build',
    generateBundle(_options, bundle) {
      const files = [...Object.keys(bundle), ...STATIC_FILES].sort();
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: serviceWorkerSource(base, files),
      });
    },
  };
}
