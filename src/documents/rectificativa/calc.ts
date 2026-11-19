import type { DocumentData, LineRow } from '../../core/document-type/types';
import { percentOfCents, sumCents } from '../../data/money';
import { NUMBERING } from './definition';
import { VAT_RATES } from './vat';

const asNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

// Importe neto de una línea en céntimos (cantidad × precio).
export function lineNet(row: LineRow): number {
  const gross = asNumber(row['cantidad']) * asNumber(row['precio']);
  return Math.round(gross);
}

// Número del documento con prefijo y serie opcional. Vacío si falta el número.
export function invoiceNumber(data: DocumentData): string {
  const n = Math.trunc(asNumber(data['numero']));
  if (!(n > 0)) return '';
  const series = String(data['serie'] ?? '').trim();
  return `${series ? `${series}/` : ''}${NUMBERING.prefix}${String(n).padStart(NUMBERING.padding, '0')}`;
}

// Cálculos en céntimos. El IVA se calcula por tipo sobre la suma de bases de ese tipo; los tipos sin
// líneas no generan valor, para que el bloque de totales omita sus filas.
export function compute(data: DocumentData): DocumentData {
  const rows = Array.isArray(data['lineas']) ? (data['lineas'] as LineRow[]) : [];
  const lineas = rows.map((row): LineRow & { importe: number } => ({
    ...row,
    importe: lineNet(row),
  }));
  const out: Record<string, unknown> = { lineas, numeroFactura: invoiceNumber(data) };
  let ivaTotal = 0;
  for (const rate of VAT_RATES) {
    const group = lineas.filter((l) => Number(l['iva'] ?? 21) === rate);
    if (group.length === 0) continue;
    const iva = percentOfCents(sumCents(group.map((l) => l.importe)), rate);
    if (rate > 0) out[`iva${rate}`] = iva;
    ivaTotal += iva;
  }
  const baseTotal = sumCents(lineas.map((l) => l.importe));
  out['baseTotal'] = baseTotal;
  out['ivaTotal'] = ivaTotal;
  out['total'] = baseTotal + ivaTotal;
  return out;
}
