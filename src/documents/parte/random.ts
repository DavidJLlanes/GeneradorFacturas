import type { DocumentData } from '../../core/document-type/types';
import type { Rng } from '../../random/rng';

const pad = (n: number): string => String(n).padStart(2, '0');

// Afina los datos aleatorios: la hora de fin va después de la de inicio (entre 1 y 5 horas).
export function refineRandomData(data: DocumentData, rng: Rng): DocumentData {
  const start = rng.int(8, 16) * 60 + rng.pick([0, 15, 30, 45]);
  const end = Math.min(start + rng.int(1, 5) * 60 + rng.pick([0, 15, 30]), 23 * 60 + 45);
  const time = (minutes: number): string => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  return { ...data, horaInicio: time(start), horaFin: time(end) };
}
