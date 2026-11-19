import type { Margins } from '../core/document/types';
import { MIN_CONTENT_MM } from './size-limits';

const round2 = (v: number): number => Math.round(v * 100) / 100;
const nonNegative = (v: number): number => (Number.isFinite(v) && v > 0 ? v : 0);

// Reduce los dos márgenes de un eje, a partes iguales en proporción, si no dejan zona útil.
function fitAxis(a: number, b: number, size: number): [number, number] {
  const room = Math.max(0, size - MIN_CONTENT_MM);
  const total = a + b;
  if (total <= room || total === 0) return [round2(a), round2(b)];
  const k = room / total;
  return [round2(a * k), round2(b * k)];
}

// Deja los márgenes en valores válidos para un papel: no negativos y sin cubrir toda la página.
export function clampMargins(margins: Margins, widthMm: number, heightMm: number): Margins {
  const [left, right] = fitAxis(nonNegative(margins.left), nonNegative(margins.right), widthMm);
  const [top, bottom] = fitAxis(nonNegative(margins.top), nonNegative(margins.bottom), heightMm);
  return { top, right, bottom, left };
}
