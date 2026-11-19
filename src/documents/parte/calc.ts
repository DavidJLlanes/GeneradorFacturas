import type { DocumentData } from '../../core/document-type/types';
import { NUMBERING } from './definition';

// Número del parte: "PT-0007". Vacío si falta el número.
export function reportNumber(data: DocumentData): string {
  const n = Math.trunc(Number(data['numero']));
  return n > 0 ? `${NUMBERING.prefix}${String(n).padStart(NUMBERING.padding, '0')}` : '';
}

// Minutos desde medianoche de una hora "HH:MM" (o "H:MM"); `null` si no es válida.
export function minutesOf(time: unknown): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(time ?? '').trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours < 24 && minutes < 60 ? hours * 60 + minutes : null;
}

// Duración entre dos horas: "2 h 30 min", "45 min" o "3 h". Si la hora de fin es anterior, se
// entiende que el trabajo pasó de medianoche.
export function duration(start: unknown, end: unknown): string {
  const from = minutesOf(start);
  const to = minutesOf(end);
  if (from === null || to === null) return '';
  const total = (to - from + 1440) % 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return [h ? `${h} h` : '', m ? `${m} min` : ''].filter(Boolean).join(' ') || '0 min';
}

export function compute(data: DocumentData): DocumentData {
  const time = duration(data['horaInicio'], data['horaFin']);
  return { numeroParte: reportNumber(data), ...(time ? { duracion: time } : {}) };
}
