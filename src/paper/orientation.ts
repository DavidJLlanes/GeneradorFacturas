import type { Page } from '../core/document/types';

export type Orientation = 'portrait' | 'landscape';

// Un papel cuadrado cuenta como vertical.
export const orientationOf = (page: Pick<Page, 'widthMm' | 'heightMm'>): Orientation =>
  page.widthMm > page.heightMm ? 'landscape' : 'portrait';

export function withOrientation(page: Page, orientation: Orientation): Page {
  if (orientationOf(page) === orientation || page.widthMm === page.heightMm) return page;
  return { ...page, widthMm: page.heightMm, heightMm: page.widthMm };
}
