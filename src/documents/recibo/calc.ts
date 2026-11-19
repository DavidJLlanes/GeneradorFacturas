import type { DocumentData } from '../../core/document-type/types';
import { NUMBERING } from './definition';
import { centsInWords } from './letras';

// Número del recibo: "R-0007". Vacío si falta el número.
export function receiptNumber(data: DocumentData): string {
  const n = Math.trunc(Number(data['numero']));
  return n > 0 ? `${NUMBERING.prefix}${String(n).padStart(NUMBERING.padding, '0')}` : '';
}

// Cálculos del recibo: su número y el importe escrito en letra (solo si hay importe).
export function compute(data: DocumentData): DocumentData {
  const words = centsInWords(Number(data['importe']));
  return { numeroRecibo: receiptNumber(data), ...(words ? { importeLetras: words } : {}) };
}
