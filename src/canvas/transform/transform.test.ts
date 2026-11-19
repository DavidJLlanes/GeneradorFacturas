import { describe, expect, it } from 'vitest';
import { resizeRect } from './resize-rect';
import { mapRectsBetweenBoxes } from './scale-rects';

const base = { keepRatio: false, fromCenter: false, minSizeMm: 1 };
const r = { x: 10, y: 20, w: 40, h: 20 };

describe('resizeRect', () => {
  it('esquina sureste crece sin mover el origen', () => {
    expect(resizeRect(r, 'se', 10, 5, base)).toEqual({ x: 10, y: 20, w: 50, h: 25 });
  });

  it('esquina noroeste mantiene fija la esquina opuesta', () => {
    const out = resizeRect(r, 'nw', -10, -5, base);
    expect(out).toEqual({ x: 0, y: 15, w: 50, h: 25 });
    expect(out.x + out.w).toBe(50);
    expect(out.y + out.h).toBe(40);
  });

  it('tiradores laterales solo cambian un eje', () => {
    expect(resizeRect(r, 'e', 10, 99, base)).toEqual({ x: 10, y: 20, w: 50, h: 20 });
    expect(resizeRect(r, 'n', 99, -10, base)).toEqual({ x: 10, y: 10, w: 40, h: 30 });
  });

  it('mantiene la proporción con shift', () => {
    const out = resizeRect(r, 'se', 20, 0, { ...base, keepRatio: true });
    expect(out.w / out.h).toBeCloseTo(2);
    expect(out.w).toBeCloseTo(60);
  });

  it('desde el centro con alt crece hacia ambos lados', () => {
    const out = resizeRect(r, 'e', 10, 0, { ...base, fromCenter: true });
    expect(out).toEqual({ x: 0, y: 20, w: 60, h: 20 });
  });

  it('no baja del tamaño mínimo ni se voltea', () => {
    const out = resizeRect(r, 'e', -100, 0, base);
    expect(out.w).toBe(1);
    const ratio = resizeRect(r, 'se', -100, -100, { ...base, keepRatio: true });
    expect(ratio.w).toBeGreaterThanOrEqual(1);
    expect(ratio.h).toBeGreaterThanOrEqual(1);
    expect(ratio.w / ratio.h).toBeCloseTo(2);
  });
});

describe('mapRectsBetweenBoxes', () => {
  it('escala de forma proporcional dentro del cuadro', () => {
    const from = { x: 0, y: 0, w: 100, h: 100 };
    const to = { x: 10, y: 10, w: 200, h: 50 };
    const out = mapRectsBetweenBoxes(new Map([['a', { x: 50, y: 50, w: 20, h: 20 }]]), from, to);
    expect(out.get('a')).toEqual({ x: 110, y: 35, w: 40, h: 10 });
  });

  it('un único elemento pasa exactamente al nuevo cuadro', () => {
    const box = { x: 5, y: 5, w: 10, h: 10 };
    const to = { x: 1, y: 2, w: 30, h: 40 };
    expect(mapRectsBetweenBoxes(new Map([['a', box]]), box, to).get('a')).toEqual(to);
  });
});
