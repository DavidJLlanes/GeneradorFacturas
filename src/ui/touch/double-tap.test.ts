// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { attachDoubleTap, DOUBLE_TAP_MS, isDoubleTap } from './double-tap';

describe('isDoubleTap', () => {
  it('sin toque previo no hay doble toque', () => {
    expect(isDoubleTap(null, { time: 100, x: 0, y: 0 })).toBe(false);
  });
  it('dos toques cercanos en tiempo y espacio lo son', () => {
    expect(isDoubleTap({ time: 0, x: 10, y: 10 }, { time: 200, x: 15, y: 12 })).toBe(true);
  });
  it('demasiado tiempo o distancia no lo son', () => {
    expect(isDoubleTap({ time: 0, x: 0, y: 0 }, { time: DOUBLE_TAP_MS + 1, x: 0, y: 0 })).toBe(
      false,
    );
    expect(isDoubleTap({ time: 0, x: 0, y: 0 }, { time: 100, x: 100, y: 0 })).toBe(false);
  });
});

function tap(el: HTMLElement, time: number): void {
  const init = { pointerType: 'touch', pointerId: 1, clientX: 20, clientY: 20 };
  const down = new MouseEvent('pointerdown', { bubbles: true, ...init });
  Object.assign(down, init);
  const up = new MouseEvent('pointerup', { bubbles: true, ...init });
  Object.assign(up, init);
  Object.defineProperty(up, 'timeStamp', { value: time });
  el.dispatchEvent(down);
  el.dispatchEvent(up);
}

describe('attachDoubleTap', () => {
  it('lanza dblclick tras dos toques seguidos', () => {
    const stage = document.createElement('div');
    let count = 0;
    stage.addEventListener('dblclick', () => count++);
    attachDoubleTap(stage);
    tap(stage, 1000);
    expect(count).toBe(0);
    tap(stage, 1200);
    expect(count).toBe(1);
    tap(stage, 1300);
    expect(count).toBe(1);
  });
});
