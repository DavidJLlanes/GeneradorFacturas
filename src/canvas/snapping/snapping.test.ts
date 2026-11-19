import { describe, expect, it } from 'vitest';
import { createPage } from '../../core/document/page';
import { snapEdges } from './snap-edges';
import { snapMove } from './snap-move';
import { snapResize } from './snap-resize';
import type { SnapSettings } from './snap-settings';
import { buildTargets } from './targets';

const page = createPage(210, 297);
const on: SnapSettings = { gridMm: 5, snapGrid: false, snapGuides: true, thresholdMm: 2 };

describe('snapEdges', () => {
  it('elige el objetivo más cercano dentro del umbral', () => {
    expect(snapEdges([10], [12, 11, 30], 2)).toEqual({ delta: 1, target: 11 });
    expect(snapEdges([10], [20], 2)).toBeNull();
  });
});

describe('snapMove', () => {
  it('imanta a bordes de otros elementos y devuelve la guía', () => {
    const targets = buildTargets([{ x: 100, y: 100, w: 20, h: 20 }], page);
    const r = snapMove({ x: 79, y: 150, w: 20, h: 10 }, targets, on);
    expect(r.dx).toBeCloseTo(1); // borde derecho 99 → 100
    expect(r.guides).toContainEqual({ axis: 'x', posMm: 100 });
  });

  it('imanta al centro de la página', () => {
    const targets = buildTargets([], page);
    const r = snapMove({ x: 94, y: 10, w: 20, h: 10 }, targets, on);
    expect(r.dx).toBeCloseTo(1); // centro 104 → 105
  });

  it('usa la rejilla cuando no hay guías cerca', () => {
    const targets = buildTargets([], page);
    const grid = { ...on, snapGuides: false, snapGrid: true };
    const r = snapMove({ x: 22.4, y: 31.2, w: 20, h: 10 }, targets, grid);
    expect(r.dx).toBeCloseTo(-2.4 + 0); // 22.4 → 20
    expect(r.dy).toBeCloseTo(-1.2); // 31.2 → 30
    expect(r.guides).toEqual([]);
  });

  it('no hace nada con todo desactivado', () => {
    const r = snapMove({ x: 1.3, y: 2.7, w: 5, h: 5 }, buildTargets([], page), {
      ...on,
      snapGuides: false,
    });
    expect(r).toEqual({ dx: 0, dy: 0, guides: [] });
  });
});

describe('snapResize', () => {
  it('imanta solo el borde que se mueve', () => {
    const targets = buildTargets([{ x: 100, y: 0, w: 10, h: 10 }], page);
    const r = snapResize({ x: 10, y: 10, w: 89, h: 20 }, 'e', targets, on, 1);
    expect(r.rect).toEqual({ x: 10, y: 10, w: 90, h: 20 });
    expect(r.guides).toContainEqual({ axis: 'x', posMm: 100 });
  });

  it('respeta el tamaño mínimo', () => {
    const targets = buildTargets([], page);
    const r = snapResize(
      { x: 10, y: 10, w: 0.2, h: 5 },
      'w',
      targets,
      { ...on, snapGuides: false },
      1,
    );
    expect(r.rect.w).toBe(1);
  });
});
