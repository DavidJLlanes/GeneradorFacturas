import { mmToPx, pxToMm } from '../../core/units/units';
import type { Size, Viewport } from '../viewport/viewport';

export const RULER_SIZE_PX = 20;

const STEPS_MM = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
const MIN_MINOR_PX = 8;
const MIN_MAJOR_PX = 60;

// Menor paso "redondo" (en mm) cuya separación en pantalla alcanza `minPx`.
const pickStep = (minPx: number, zoom: number): number =>
  STEPS_MM.find((s) => mmToPx(s) * zoom >= minPx) ?? STEPS_MM[STEPS_MM.length - 1] ?? 1000;

function drawRuler(canvas: HTMLCanvasElement, horizontal: boolean, vp: Viewport, length: number) {
  const dpr = window.devicePixelRatio || 1;
  const cssW = horizontal ? length : RULER_SIZE_PX;
  const cssH = horizontal ? RULER_SIZE_PX : length;
  canvas.width = Math.max(1, Math.round(cssW * dpr));
  canvas.height = Math.max(1, Math.round(cssH * dpr));
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);
  const color = getComputedStyle(canvas).color;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.font = '10px system-ui, sans-serif';
  ctx.lineWidth = 1;

  const pan = horizontal ? vp.panX : vp.panY;
  const minor = pickStep(MIN_MINOR_PX, vp.zoom);
  const major = pickStep(MIN_MAJOR_PX, vp.zoom);
  const startMm = pxToMm((0 - pan) / vp.zoom);
  const endMm = pxToMm((length - pan) / vp.zoom);

  ctx.beginPath();
  for (let mm = Math.floor(startMm / minor) * minor; mm <= endMm; mm += minor) {
    const pos = Math.round(mmToPx(mm) * vp.zoom + pan) + 0.5;
    const isMajor = Math.abs(mm / major - Math.round(mm / major)) < 1e-6;
    const tick = isMajor ? RULER_SIZE_PX * 0.6 : RULER_SIZE_PX * 0.3;
    if (horizontal) {
      ctx.moveTo(pos, RULER_SIZE_PX);
      ctx.lineTo(pos, RULER_SIZE_PX - tick);
      if (isMajor) ctx.fillText(String(Math.round(mm)), pos + 2, 9);
    } else {
      ctx.moveTo(RULER_SIZE_PX, pos);
      ctx.lineTo(RULER_SIZE_PX - tick, pos);
      if (isMajor) {
        ctx.save();
        ctx.translate(9, pos - 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(String(Math.round(mm)), 0, 0);
        ctx.restore();
      }
    }
  }
  ctx.stroke();
}

// Reglas en milímetros sobre y a la izquierda del escenario, sincronizadas con el zoom y el desplazamiento.
export function createRulers(): {
  horizontal: HTMLElement;
  vertical: HTMLElement;
  update(vp: Viewport, size: Size): void;
} {
  const make = (axis: 'x' | 'y') => {
    const wrap = document.createElement('div');
    wrap.className = `cv-ruler cv-ruler-${axis}`;
    const canvas = document.createElement('canvas');
    wrap.append(canvas);
    return { wrap, canvas };
  };
  const x = make('x');
  const y = make('y');

  return {
    horizontal: x.wrap,
    vertical: y.wrap,
    update(vp, size) {
      if (size.w <= 0 || size.h <= 0) return;
      drawRuler(x.canvas, true, vp, size.w);
      drawRuler(y.canvas, false, vp, size.h);
    },
  };
}
