import type { Page } from '../../core/document/types';
import type { Rect } from '../../core/geometry/rect';

export interface SnapTargets {
  x: number[];
  y: number[];
}

// Posiciones a las que se puede imantar: bordes, centro y márgenes de la página,
// y bordes y centros de los demás elementos.
export function buildTargets(others: readonly Rect[], page: Page): SnapTargets {
  const { top, right, bottom, left } = page.marginsMm;
  const x = [0, page.widthMm / 2, page.widthMm, left, page.widthMm - right];
  const y = [0, page.heightMm / 2, page.heightMm, top, page.heightMm - bottom];
  for (const r of others) {
    x.push(r.x, r.x + r.w / 2, r.x + r.w);
    y.push(r.y, r.y + r.h / 2, r.y + r.h);
  }
  return { x, y };
}
