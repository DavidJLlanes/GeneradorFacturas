import type { DocumentData, LineRow } from '../../core/document-type/types';
import { percentOfCents, sumCents } from '../../data/money';
import { NUMBERING } from './definition';
import { VAT_RATES } from './vat';

const asNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

// Importe neto de una línea en céntimos: cantidad × precio, menos el descuento (0–100 %).
export function lineNet(row: LineRow): number {
  const gross = asNumber(row['cantidad']) * asNumber(row['precio']);
  const discount = Math.min(100, Math.max(0, asNumber(row['descuento'])));
  return Math.round(gross * (1 - discount / 100));
}

// Número del presupuesto: "P-0007", o "2026/P-0007" con serie. Vacío si falta el número.
export function quoteNumber(data: DocumentData): string {
  const n = Math.trunc(asNumber(data['numero']));
  if (!(n > 0)) return '';
  const series = String(data['serie'] ?? '').trim();
  return `${series ? `${series}/` : ''}${NUMBERING.prefix}${String(n).padStart(NUMBERING.padding, '0')}`;
}

// Fecha (AAAA-MM-DD) más un número de días. Vacío si la fecha no es válida.
export function addDays(isoDate: unknown, days: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate ?? ''));
  if (!match) return '';
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// Cálculos del presupuesto, en céntimos. El IVA se calcula por tipo sobre la suma de bases de ese
// tipo; los tipos sin líneas no generan valor, para que el bloque de totales omita sus filas.
export function compute(data: DocumentData): DocumentData {
  const rows = Array.isArray(data['lineas']) ? (data['lineas'] as LineRow[]) : [];
  const lineas = rows.map((row): LineRow & { importe: number } => ({
    ...row,
    importe: lineNet(row),
  }));
  const out: Record<string, unknown> = { lineas, numeroPresupuesto: quoteNumber(data) };

  const days = Math.trunc(asNumber(data['validezDias']));
  const until = days > 0 ? addDays(data['fecha'], days) : '';
  if (until) out['validoHasta'] = until;

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
