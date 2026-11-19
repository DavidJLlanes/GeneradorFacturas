import type { Page } from '../../core/document/types';
import type { Point, Rect } from '../../core/geometry/rect';
import { mmToPx, pxToMm } from '../../core/units/units';

// Posición de la página en pantalla: píxeles = mm * PX_PER_MM * zoom + pan.
export interface Viewport {
  zoom: number;
  panX: number;
  panY: number;
}

export interface Size {
  w: number;
  h: number;
}

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 32;

export const clampZoom = (zoom: number): number => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));

export const pageRect = (page: Page): Rect => ({ x: 0, y: 0, w: page.widthMm, h: page.heightMm });

export function pageToScreen(vp: Viewport, p: Point): Point {
  return { x: mmToPx(p.x) * vp.zoom + vp.panX, y: mmToPx(p.y) * vp.zoom + vp.panY };
}

export function screenToPage(vp: Viewport, p: Point): Point {
  return { x: pxToMm((p.x - vp.panX) / vp.zoom), y: pxToMm((p.y - vp.panY) / vp.zoom) };
}

// Rectángulo de la página (mm) llevado a píxeles de pantalla.
export function rectToScreen(vp: Viewport, r: Rect): Rect {
  const origin = pageToScreen(vp, r);
  return { x: origin.x, y: origin.y, w: mmToPx(r.w) * vp.zoom, h: mmToPx(r.h) * vp.zoom };
}

// Distancia en píxeles de pantalla convertida a milímetros de página.
export const screenDeltaToMm = (vp: Viewport, px: number): number => pxToMm(px / vp.zoom);

// Cambia el zoom manteniendo fijo el punto de pantalla `anchor`.
export function zoomAround(vp: Viewport, anchor: Point, targetZoom: number): Viewport {
  const zoom = clampZoom(targetZoom);
  const px = (anchor.x - vp.panX) / vp.zoom;
  const py = (anchor.y - vp.panY) / vp.zoom;
  return { zoom, panX: anchor.x - px * zoom, panY: anchor.y - py * zoom };
}

// Encuadra un rectángulo (en mm) centrado en un área de `size` píxeles.
export function fitRect(size: Size, rect: Rect, paddingPx = 40): Viewport {
  const availW = Math.max(1, size.w - 2 * paddingPx);
  const availH = Math.max(1, size.h - 2 * paddingPx);
  const zoom = clampZoom(Math.min(availW / mmToPx(rect.w), availH / mmToPx(rect.h)));
  return {
    zoom,
    panX: (size.w - mmToPx(rect.w) * zoom) / 2 - mmToPx(rect.x) * zoom,
    panY: (size.h - mmToPx(rect.h) * zoom) / 2 - mmToPx(rect.y) * zoom,
  };
}
