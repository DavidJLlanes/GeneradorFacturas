// Conversión entre milímetros del documento y píxeles CSS (96 ppp) a zoom 1.

export const PX_PER_MM = 96 / 25.4;

export const mmToPx = (mm: number): number => mm * PX_PER_MM;
export const pxToMm = (px: number): number => px / PX_PER_MM;
