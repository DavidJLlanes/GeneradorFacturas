import type { DocumentData, LineRow } from '../../core/document-type/types';
import { NUMBERING } from './definition';

const asNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

// Número del albarán: "AL-0007", o "2026/AL-0007" con serie. Vacío si falta el número.
export function deliveryNumber(data: DocumentData): string {
  const n = Math.trunc(asNumber(data['numero']));
  if (!(n > 0)) return '';
  const series = String(data['serie'] ?? '').trim();
  return `${series ? `${series}/` : ''}${NUMBERING.prefix}${String(n).padStart(NUMBERING.padding, '0')}`;
}

// Un albarán no lleva precios: solo el número y el total de unidades (sin errores de coma flotante).
export function compute(data: DocumentData): DocumentData {
  const rows = Array.isArray(data['lineas']) ? (data['lineas'] as LineRow[]) : [];
  const total = rows.reduce((sum, row) => sum + Math.max(0, asNumber(row['cantidad'])), 0);
  return {
    numeroAlbaran: deliveryNumber(data),
    totalUnidades: Math.round(total * 1000) / 1000,
  };
}
