import type { Numbering } from '../../core/document-type/types';

export const ID = 'rectificativa';
export const NAME = 'Factura rectificativa';
export const DESCRIPTION =
  'Factura rectificativa o de abono: referencia a la factura que corrige, motivo e importes con signo.';
export const DEFAULT_PAPER_ID = 'a4';
export const NUMBERING: Numbering = { prefix: 'RE-', padding: 4 };
