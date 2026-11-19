import type { DocElement, DocumentModel } from '../core/document/types';

// Documento de prueba para probar el lienzo. Se sustituirá cuando existan las piezas reales (Fase 4).
const box = (id: string, name: string, x: number, y: number, w: number, h: number): DocElement => ({
  id,
  name,
  x,
  y,
  w,
  h,
  locked: false,
  hidden: false,
});

export function createDemoDocument(): DocumentModel {
  return {
    page: { widthMm: 210, heightMm: 297 },
    elements: [
      box('demo-1', 'Cabecera', 15, 15, 180, 30),
      box('demo-2', 'Datos del cliente', 15, 55, 85, 35),
      box('demo-3', 'Tabla', 15, 100, 180, 110),
      box('demo-4', 'Totales', 120, 220, 75, 40),
    ],
  };
}
