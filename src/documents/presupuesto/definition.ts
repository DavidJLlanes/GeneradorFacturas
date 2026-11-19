import type { Numbering } from '../../core/document-type/types';

export const ID = 'presupuesto';
export const NAME = 'Presupuesto';
export const DESCRIPTION =
  'Oferta con líneas e IVA, plazo de validez, condiciones y recuadro de aceptación del cliente.';
export const DEFAULT_PAPER_ID = 'a4';
export const NUMBERING: Numbering = { prefix: 'P-', padding: 4 };
