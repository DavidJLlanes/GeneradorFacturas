export const MIN_PAGE_MM = 20;
export const MAX_PAGE_MM = 5000;

/** Anchura mínima de la zona útil que los márgenes no pueden invadir. */
export const MIN_CONTENT_MM = 10;

const round2 = (v: number): number => Math.round(v * 100) / 100;

export const clampPageSize = (mm: number): number =>
  round2(Math.min(MAX_PAGE_MM, Math.max(MIN_PAGE_MM, Number.isFinite(mm) ? mm : MIN_PAGE_MM)));
