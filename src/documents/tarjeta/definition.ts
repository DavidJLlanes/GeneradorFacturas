import type { Numbering } from '../../core/document-type/types';

export const ID = 'tarjeta';
export const NAME = 'Tarjeta de visita';
export const DESCRIPTION =
  'Tarjeta de visita de 85 × 55 mm: nombre, cargo, empresa, contacto y logo.';
export const DEFAULT_PAPER_ID = 'a6';
export const NUMBERING: Numbering = { prefix: 'TV-', padding: 4 };
