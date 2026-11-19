import type { Rect } from '../../core/geometry/rect';

// Reubica rectángulos de forma proporcional cuando el cuadro que los contiene pasa de `from` a `to`.
export function mapRectsBetweenBoxes(
  rects: ReadonlyMap<string, Rect>,
  from: Rect,
  to: Rect,
): Map<string, Rect> {
  const sx = from.w === 0 ? 1 : to.w / from.w;
  const sy = from.h === 0 ? 1 : to.h / from.h;
  const out = new Map<string, Rect>();
  for (const [id, r] of rects) {
    out.set(id, {
      x: to.x + (r.x - from.x) * sx,
      y: to.y + (r.y - from.y) * sy,
      w: r.w * sx,
      h: r.h * sy,
    });
  }
  return out;
}
