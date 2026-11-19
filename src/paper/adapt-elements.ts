import type { DocElement, Page } from '../core/document/types';

// Qué hacer con las piezas al cambiar el tamaño del papel.
//  - keep:    no tocarlas.
//  - stretch: escalarlas en cada eje según el cambio de ancho y alto (llenan el nuevo papel).
//  - fit:     escalarlas por igual (sin deformar) y centrarlas.
export type AdaptMode = 'keep' | 'stretch' | 'fit';

type Size = Pick<Page, 'widthMm' | 'heightMm'>;

const round2 = (v: number): number => Math.round(v * 100) / 100;

export function adaptElements(
  elements: readonly DocElement[],
  from: Size,
  to: Size,
  mode: AdaptMode,
): readonly DocElement[] {
  if (mode === 'keep') return elements;
  if (from.widthMm === to.widthMm && from.heightMm === to.heightMm) return elements;

  const sx = to.widthMm / from.widthMm;
  const sy = to.heightMm / from.heightMm;
  let kx = sx;
  let ky = sy;
  let ox = 0;
  let oy = 0;
  if (mode === 'fit') {
    const k = Math.min(sx, sy);
    kx = k;
    ky = k;
    ox = (to.widthMm - from.widthMm * k) / 2;
    oy = (to.heightMm - from.heightMm * k) / 2;
  }

  return elements.map((e) => ({
    ...e,
    x: round2(ox + e.x * kx),
    y: round2(oy + e.y * ky),
    w: round2(e.w * kx),
    h: round2(e.h * ky),
  }));
}
