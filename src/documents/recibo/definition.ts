import type { Numbering } from '../../core/document-type/types';

export const ID = 'recibo';
export const NAME = 'Recibo';
export const DESCRIPTION =
  'Recibo de pago: importe en cifras y en letra, concepto, forma de pago y firma de quien cobra.';
export const DEFAULT_PAPER_ID = 'a5';
export const NUMBERING: Numbering = { prefix: 'R-', padding: 4 };
