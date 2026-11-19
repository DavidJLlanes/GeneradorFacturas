import { describe, expect, it } from 'vitest';
import { pointInRect, rectFromPoints, rectsIntersect, translateRect, unionRect } from './rect';

describe('rect', () => {
  it('une rectángulos', () => {
    expect(unionRect([])).toBeNull();
    expect(
      unionRect([
        { x: 10, y: 10, w: 10, h: 10 },
        { x: 0, y: 30, w: 5, h: 5 },
      ]),
    ).toEqual({ x: 0, y: 10, w: 20, h: 25 });
  });

  it('detecta intersección sin contar bordes que solo se tocan', () => {
    const a = { x: 0, y: 0, w: 10, h: 10 };
    expect(rectsIntersect(a, { x: 5, y: 5, w: 10, h: 10 })).toBe(true);
    expect(rectsIntersect(a, { x: 10, y: 0, w: 10, h: 10 })).toBe(false);
  });

  it('comprueba punto dentro y traslada', () => {
    const r = { x: 0, y: 0, w: 10, h: 10 };
    expect(pointInRect({ x: 10, y: 10 }, r)).toBe(true);
    expect(pointInRect({ x: 11, y: 5 }, r)).toBe(false);
    expect(translateRect(r, 3, -2)).toEqual({ x: 3, y: -2, w: 10, h: 10 });
  });

  it('crea un rectángulo desde dos puntos en cualquier orden', () => {
    expect(rectFromPoints({ x: 10, y: 20 }, { x: 4, y: 8 })).toEqual({ x: 4, y: 8, w: 6, h: 12 });
  });
});
