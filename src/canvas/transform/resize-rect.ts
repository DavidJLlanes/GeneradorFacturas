import type { Rect } from '../../core/geometry/rect';
import type { HandleId } from './handles';

export interface ResizeOptions {
  keepRatio: boolean;
  fromCenter: boolean;
  minSizeMm: number;
}

// Nuevo rectángulo al arrastrar un tirador (dx, dy en mm). No se permite voltear: se limita al mínimo.
export function resizeRect(
  orig: Rect,
  handle: HandleId,
  dx: number,
  dy: number,
  opts: ResizeOptions,
): Rect {
  const hasW = handle.includes('w');
  const hasE = handle.includes('e');
  const hasN = handle.includes('n');
  const hasS = handle.includes('s');
  const k = opts.fromCenter ? 2 : 1;

  let w = orig.w + ((hasE ? dx : 0) - (hasW ? dx : 0)) * k;
  let h = orig.h + ((hasS ? dy : 0) - (hasN ? dy : 0)) * k;

  if (opts.keepRatio && orig.w > 0 && orig.h > 0) {
    const horizontal = hasW || hasE;
    const vertical = hasN || hasS;
    let scale: number;
    if (horizontal && vertical) {
      const sw = w / orig.w;
      const sh = h / orig.h;
      scale = Math.abs(sw - 1) >= Math.abs(sh - 1) ? sw : sh;
    } else {
      scale = horizontal ? w / orig.w : h / orig.h;
    }
    scale = Math.max(scale, opts.minSizeMm / orig.w, opts.minSizeMm / orig.h);
    w = orig.w * scale;
    h = orig.h * scale;
  } else {
    w = Math.max(w, opts.minSizeMm);
    h = Math.max(h, opts.minSizeMm);
  }

  const cx = orig.x + orig.w / 2;
  const cy = orig.y + orig.h / 2;
  const x = opts.fromCenter ? cx - w / 2 : hasW ? orig.x + orig.w - w : hasE ? orig.x : cx - w / 2;
  const y = opts.fromCenter ? cy - h / 2 : hasN ? orig.y + orig.h - h : hasS ? orig.y : cy - h / 2;
  return { x, y, w, h };
}
