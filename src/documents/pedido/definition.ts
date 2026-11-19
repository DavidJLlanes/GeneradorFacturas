import type { Numbering } from '../../core/document-type/types';

export const ID = 'pedido';
export const NAME = 'Pedido de compra';
export const DESCRIPTION =
  'Pedido u orden de compra a un proveedor: líneas con IVA, lugar y fecha de entrega, condiciones y autorización.';
export const DEFAULT_PAPER_ID = 'a4';
export const NUMBERING: Numbering = { prefix: 'PC-', padding: 4 };
