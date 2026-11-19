import type { Page } from '../core/document/types';
import { PAPER_PRESETS, type PaperPreset } from './paper-presets';

const EPSILON_MM = 0.05;
const close = (a: number, b: number): boolean => Math.abs(a - b) < EPSILON_MM;

// Papel estándar que coincide con las medidas de la página (en vertical u horizontal), o null si es personalizado.
// Los de largo continuo solo comparan el ancho.
export function matchPreset(page: Pick<Page, 'widthMm' | 'heightMm'>): PaperPreset | null {
  for (const p of PAPER_PRESETS) {
    if (p.continuous) {
      if (close(page.widthMm, p.widthMm)) return p;
      continue;
    }
    const portrait = close(page.widthMm, p.widthMm) && close(page.heightMm, p.heightMm);
    const landscape = close(page.widthMm, p.heightMm) && close(page.heightMm, p.widthMm);
    if (portrait || landscape) return p;
  }
  return null;
}
