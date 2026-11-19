import type { DocumentData } from '../../core/document-type/types';

// Fecha (AAAA-MM-DD) más un número de días. Vacío si la fecha no es válida.
export function addDays(isoDate: unknown, days: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate ?? ''));
  if (!match) return '';
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// La fecha límite de respuesta solo existe si hay fecha de la carta y un plazo en días.
export function compute(data: DocumentData): DocumentData {
  const days = Math.trunc(Number(data['plazoDias']));
  const limit = days > 0 ? addDays(data['fecha'], days) : '';
  return limit ? { fechaLimite: limit } : {};
}
