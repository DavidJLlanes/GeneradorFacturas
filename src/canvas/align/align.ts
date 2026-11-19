import { rectOf } from '../../core/document/element-rect';
import type { DocElement } from '../../core/document/types';
import type { Rect } from '../../core/geometry/rect';

export type AlignMode = 'left' | 'hcenter' | 'right' | 'top' | 'vmiddle' | 'bottom';

// Alinea respecto a `reference` (el cuadro de la selección o la página).
export function alignElements(
  elements: readonly DocElement[],
  mode: AlignMode,
  reference: Rect,
): Map<string, Rect> {
  const out = new Map<string, Rect>();
  for (const el of elements) {
    const r = rectOf(el);
    let { x, y } = r;
    switch (mode) {
      case 'left':
        x = reference.x;
        break;
      case 'hcenter':
        x = reference.x + (reference.w - r.w) / 2;
        break;
      case 'right':
        x = reference.x + reference.w - r.w;
        break;
      case 'top':
        y = reference.y;
        break;
      case 'vmiddle':
        y = reference.y + (reference.h - r.h) / 2;
        break;
      case 'bottom':
        y = reference.y + reference.h - r.h;
        break;
    }
    out.set(el.id, { ...r, x, y });
  }
  return out;
}
