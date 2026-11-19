import type { Numbering } from '../../core/document-type/types';

export const ID = 'etiqueta';
export const NAME = 'Etiqueta';
export const DESCRIPTION =
  'Etiqueta de producto 100 × 60 mm: nombre, referencia, precio, lote y código QR.';
export const DEFAULT_PAPER_ID = 'a6';
export const NUMBERING: Numbering = { prefix: 'E-', padding: 4 };
