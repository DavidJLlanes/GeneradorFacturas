import type { DocElement, Page } from '../core/document/types';

// Zona útil de las páginas de continuación: entre las piezas repetidas de arriba (cabecera) y de abajo (pie).
export interface Zones {
  /** Dónde empieza el contenido en las páginas siguientes a la primera. */
  continuationTop: number;
  /** Límite inferior del contenido en todas las páginas. */
  bodyBottom: number;
}

const MIN_BODY_MM = 20;

export function zonesOf(page: Page, repeated: readonly DocElement[]): Zones {
  const top = page.marginsMm.top;
  const bottom = page.heightMm - page.marginsMm.bottom;
  let continuationTop = top;
  let bodyBottom = bottom;
  for (const el of repeated) {
    if (el.y + el.h / 2 < page.heightMm / 2)
      continuationTop = Math.max(continuationTop, el.y + el.h);
    else bodyBottom = Math.min(bodyBottom, el.y);
  }
  // Si las piezas repetidas no dejan sitio, se ignoran para el reparto.
  if (bodyBottom - continuationTop < MIN_BODY_MM)
    return { continuationTop: top, bodyBottom: bottom };
  return { continuationTop, bodyBottom };
}
