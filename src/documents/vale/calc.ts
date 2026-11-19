import type { DocumentData } from '../../core/document-type/types';
import { NUMBERING } from './definition';

// Número del vale: "V-0007". Vacío si falta el número.
export function voucherNumber(data: DocumentData): string {
  const n = Math.trunc(Number(data['numero']));
  return n > 0 ? `${NUMBERING.prefix}${String(n).padStart(NUMBERING.padding, '0')}` : '';
}

export const compute = (data: DocumentData): DocumentData => ({ numeroVale: voucherNumber(data) });
