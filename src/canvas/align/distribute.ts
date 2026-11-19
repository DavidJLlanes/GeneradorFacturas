import { rectOf } from '../../core/document/element-rect';
import type { DocElement } from '../../core/document/types';
import type { Rect } from '../../core/geometry/rect';

export type DistributeAxis = 'horizontal' | 'vertical';

// Reparte el espacio libre a partes iguales entre los elementos (mínimo 3).
export function distributeElements(
  elements: readonly DocElement[],
  axis: DistributeAxis,
): Map<string, Rect> {
  const out = new Map<string, Rect>();
  if (elements.length < 3) return out;

  const horizontal = axis === 'horizontal';
  const size = (e: DocElement) => (horizontal ? e.w : e.h);
  const start = (e: DocElement) => (horizontal ? e.x : e.y);
  const sorted = [...elements].sort((a, b) => start(a) - start(b));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (!first || !last) return out;

  const from = start(first);
  const to = start(last) + size(last);
  const total = sorted.reduce((sum, e) => sum + size(e), 0);
  const gap = (to - from - total) / (sorted.length - 1);

  let cursor = from;
  for (const el of sorted) {
    const r = rectOf(el);
    out.set(el.id, horizontal ? { ...r, x: cursor } : { ...r, y: cursor });
    cursor += size(el) + gap;
  }
  return out;
}
