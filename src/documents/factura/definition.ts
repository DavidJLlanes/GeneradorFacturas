import type { Numbering } from '../../core/document-type/types';

export const ID = 'factura';
export const NAME = 'Factura';
export const DESCRIPTION =
  'Factura con IVA por línea, IRPF, recargo de equivalencia, exenciones y series de numeración.';
export const DEFAULT_PAPER_ID = 'a4';
export const NUMBERING: Numbering = { prefix: '', padding: 4 };
