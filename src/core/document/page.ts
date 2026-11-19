import type { Rect } from '../geometry/rect';
import type { Margins, Page } from './types';

export const DEFAULT_MARGIN_MM = 10;

export const uniformMargins = (mm: number): Margins => ({
  top: mm,
  right: mm,
  bottom: mm,
  left: mm,
});

export const createPage = (
  widthMm: number,
  heightMm: number,
  marginMm = DEFAULT_MARGIN_MM,
): Page => ({ widthMm, heightMm, marginsMm: uniformMargins(marginMm) });

// Zona útil de la página: lo que queda dentro de los márgenes (en mm).
export const contentRect = (page: Page): Rect => ({
  x: page.marginsMm.left,
  y: page.marginsMm.top,
  w: page.widthMm - page.marginsMm.left - page.marginsMm.right,
  h: page.heightMm - page.marginsMm.top - page.marginsMm.bottom,
});

export const sameMargins = (a: Margins, b: Margins): boolean =>
  a.top === b.top && a.right === b.right && a.bottom === b.bottom && a.left === b.left;

export const samePage = (a: Page, b: Page): boolean =>
  a.widthMm === b.widthMm && a.heightMm === b.heightMm && sameMargins(a.marginsMm, b.marginsMm);
