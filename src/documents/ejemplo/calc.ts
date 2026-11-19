import type { DocumentData, LineRow } from '../../core/document-type/types';
import { percentOfCents, sumCents } from '../../data/money';

const VAT_PERCENT = 21;

// Cálculos del tipo: importe de cada línea (cantidad × precio), subtotal, IVA y total. En céntimos.
export function compute(data: DocumentData): DocumentData {
  const raw = Array.isArray(data['lineas']) ? (data['lineas'] as LineRow[]) : [];
  const lineas = raw.map((row) => ({
    ...row,
    importe: Math.round(Number(row['cantidad'] ?? 0) * Number(row['precio'] ?? 0)),
  }));
  const subtotal = sumCents(lineas.map((l) => l.importe));
  const iva = percentOfCents(subtotal, VAT_PERCENT);
  return { lineas, subtotal, iva, total: subtotal + iva };
}
