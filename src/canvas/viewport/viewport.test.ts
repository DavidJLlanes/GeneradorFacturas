import { describe, expect, it } from 'vitest';
import { mmToPx } from '../../core/units/units';
import {
  MAX_ZOOM,
  MIN_ZOOM,
  clampZoom,
  fitRect,
  pageToScreen,
  screenToPage,
  zoomAround,
} from './viewport';

describe('viewport', () => {
  const vp = { zoom: 2, panX: 30, panY: -10 };

  it('convierte página ↔ pantalla de forma inversa', () => {
    const p = { x: 12.5, y: 40 };
    const back = screenToPage(vp, pageToScreen(vp, p));
    expect(back.x).toBeCloseTo(p.x);
    expect(back.y).toBeCloseTo(p.y);
  });

  it('limita el zoom', () => {
    expect(clampZoom(0.001)).toBe(MIN_ZOOM);
    expect(clampZoom(999)).toBe(MAX_ZOOM);
  });

  it('el zoom mantiene fijo el punto bajo el cursor', () => {
    const anchor = { x: 200, y: 150 };
    const before = screenToPage(vp, anchor);
    const next = zoomAround(vp, anchor, 5);
    const after = screenToPage(next, anchor);
    expect(next.zoom).toBe(5);
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
  });

  it('encuadra un rectángulo centrado', () => {
    const size = { w: 800, h: 600 };
    const rect = { x: 0, y: 0, w: 210, h: 297 };
    const fit = fitRect(size, rect, 40);
    const topLeft = pageToScreen(fit, { x: 0, y: 0 });
    const bottomRight = pageToScreen(fit, { x: rect.w, y: rect.h });
    expect(topLeft.x + bottomRight.x).toBeCloseTo(size.w);
    expect(topLeft.y + bottomRight.y).toBeCloseTo(size.h);
    expect(mmToPx(rect.h) * fit.zoom).toBeLessThanOrEqual(600 - 80 + 0.001);
  });
});
