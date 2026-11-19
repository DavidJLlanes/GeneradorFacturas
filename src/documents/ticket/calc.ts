import type { DocumentData, LineRow } from '../../core/document-type/types';
import { sumCents } from '../../data/money';
import { NUMBERING } from './definition';

const asNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

// Importe de una línea en céntimos: cantidad × precio (los precios del ticket ya llevan IVA).
export const lineTotal = (row: LineRow): number =>
  Math.round(asNumber(row['cantidad']) * asNumber(row['precio']));

// Número del ticket: "T000042". Vacío si falta el número.
export function ticketNumber(data: DocumentData): string {
  const n = Math.trunc(asNumber(data['numero']));
  return n > 0 ? `${NUMBERING.prefix}${String(n).padStart(NUMBERING.padding, '0')}` : '';
}

// Cuota de IVA contenida en un total con IVA incluido.
export const vatIncluded = (totalCents: number, percent: number): number =>
  percent > 0 ? totalCents - Math.round(totalCents / (1 + percent / 100)) : 0;

export function compute(data: DocumentData): DocumentData {
  const rows = Array.isArray(data['lineas']) ? (data['lineas'] as LineRow[]) : [];
  const lineas = rows.map((row): LineRow & { importe: number } => ({
    ...row,
    importe: lineTotal(row),
  }));
  const total = sumCents(lineas.map((l) => l.importe));
  const iva = vatIncluded(total, asNumber(data['iva'] ?? 21));
  return {
    lineas,
    numeroTicket: ticketNumber(data),
    total,
    ...(iva > 0 ? { ivaIncluido: iva } : {}),
  };
}
