import type { Rect } from '../../core/geometry/rect';
import type { GuideLine } from './guide-line';
import { snapAxis } from './snap-axis';
import type { SnapSettings } from './snap-settings';
import type { SnapTargets } from './targets';

export interface SnapMoveResult {
  dx: number;
  dy: number;
  guides: GuideLine[];
}

// Ajuste (dx, dy) que hay que sumar a un rectángulo en movimiento para imantarlo.
export function snapMove(rect: Rect, targets: SnapTargets, settings: SnapSettings): SnapMoveResult {
  const sx = snapAxis(
    [rect.x, rect.x + rect.w / 2, rect.x + rect.w],
    rect.x,
    targets.x,
    'x',
    settings,
  );
  const sy = snapAxis(
    [rect.y, rect.y + rect.h / 2, rect.y + rect.h],
    rect.y,
    targets.y,
    'y',
    settings,
  );
  const guides = [sx.guide, sy.guide].filter((g): g is GuideLine => g !== null);
  return { dx: sx.delta, dy: sy.delta, guides };
}
