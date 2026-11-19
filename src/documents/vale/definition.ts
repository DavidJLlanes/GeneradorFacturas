import type { Numbering } from '../../core/document-type/types';

export const ID = 'vale';
export const NAME = 'Vale';
export const DESCRIPTION =
  'Vale regalo o de descuento: importe destacado, código con QR, beneficiario y fecha de validez.';
export const DEFAULT_PAPER_ID = 'a6';
export const NUMBERING: Numbering = { prefix: 'V-', padding: 4 };
