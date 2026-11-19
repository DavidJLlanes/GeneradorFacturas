import type { GuideLine } from './guide-line';
import { snapToGrid } from './grid';
import { snapEdges } from './snap-edges';
import type { SnapSettings } from './snap-settings';

export interface AxisSnap {
  delta: number;
  guide: GuideLine | null;
}

// Imanta en un eje: primero a guías (bordes/centros), si no a la rejilla usando `gridRef`.
export function snapAxis(
  edges: readonly number[],
  gridRef: number,
  targets: readonly number[],
  axis: 'x' | 'y',
  settings: SnapSettings,
): AxisSnap {
  if (settings.snapGuides) {
    const hit = snapEdges(edges, targets, settings.thresholdMm);
    if (hit) return { delta: hit.delta, guide: { axis, posMm: hit.target } };
  }
  if (settings.snapGrid) {
    return { delta: snapToGrid(gridRef, settings.gridMm) - gridRef, guide: null };
  }
  return { delta: 0, guide: null };
}
