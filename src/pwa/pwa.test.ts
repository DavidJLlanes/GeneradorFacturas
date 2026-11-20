import { describe, expect, it } from 'vitest';
import { hashOf, serviceWorkerSource } from './service-worker-source';

describe('service worker', () => {
  const source = serviceWorkerSource('/factura/', ['assets/index-abc.js', 'manifest.webmanifest']);

  it('lista la página y los archivos con la ruta base', () => {
    expect(source).toContain('"/factura/"');
    expect(source).toContain('"/factura/assets/index-abc.js"');
    expect(source).toContain('"/factura/manifest.webmanifest"');
  });

  it('es JavaScript válido', () => {
    expect(() => new Function(source)).not.toThrow();
  });

  it('la versión cambia si cambian los archivos', () => {
    const other = serviceWorkerSource('/factura/', ['assets/index-xyz.js']);
    expect(other).not.toBe(source);
    expect(hashOf('a')).not.toBe(hashOf('b'));
  });
});
