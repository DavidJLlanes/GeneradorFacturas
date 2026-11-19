import type { Rect } from '../../core/geometry/rect';
import type { HandleId } from '../transform/handles';
import type { GuideLine } from './guide-line';
import { snapAxis } from './snap-axis';
import type { SnapSettings } from './snap-settings';
import type { SnapTargets } from './targets';

export interface SnapResizeResult {
  rect: Rect;
  guides: GuideLine[];
}

// Imanta solo los bordes que se están moviendo con el tirador.
export function snapResize(
  rect: Rect,
  handle: HandleId,
  targets: SnapTargets,
  settings: SnapSettings,
  minSizeMm: number,
): SnapResizeResult {
  const guides: GuideLine[] = [];
  const right = rect.x + rect.w;
  const bottom = rect.y + rect.h;
  let { x, y, w, h } = rect;

  if (handle.includes('w')) {
    const s = snapAxis([x], x, targets.x, 'x', settings);
    if (s.guide) guides.push(s.guide);
    w = Math.max(right - (x + s.delta), minSizeMm);
    x = right - w;
  } else if (handle.includes('e')) {
    const s = snapAxis([right], right, targets.x, 'x', settings);
    if (s.guide) guides.push(s.guide);
    w = Math.max(right + s.delta - x, minSizeMm);
  }

  if (handle.includes('n')) {
    const s = snapAxis([y], y, targets.y, 'y', settings);
    if (s.guide) guides.push(s.guide);
    h = Math.max(bottom - (y + s.delta), minSizeMm);
    y = bottom - h;
  } else if (handle.includes('s')) {
    const s = snapAxis([bottom], bottom, targets.y, 'y', settings);
    if (s.guide) guides.push(s.guide);
    h = Math.max(bottom + s.delta - y, minSizeMm);
  }

  return { rect: { x, y, w, h }, guides };
}
