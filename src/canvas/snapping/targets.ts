import type { Page } from '../../core/document/types';
import type { Rect } from '../../core/geometry/rect';

export interface SnapTargets {
  x: number[];
  y: number[];
}

// Posiciones a las que se puede imantar: bordes y centro de la página y de los demás elementos.
export function buildTargets(others: readonly Rect[], page: Page): SnapTargets {
  const x = [0, page.widthMm / 2, page.widthMm];
  const y = [0, page.heightMm / 2, page.heightMm];
  for (const r of others) {
    x.push(r.x, r.x + r.w / 2, r.x + r.w);
    y.push(r.y, r.y + r.h / 2, r.y + r.h);
  }
  return { x, y };
}
