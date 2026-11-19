import type { Numbering } from '../../core/document-type/types';

export const ID = 'ticket';
export const NAME = 'Ticket';
export const DESCRIPTION =
  'Ticket de venta para impresora de 80 mm: líneas con importe, total con IVA incluido y forma de pago.';
export const DEFAULT_PAPER_ID = 'ticket-80';
export const NUMBERING: Numbering = { prefix: 'T', padding: 6 };
