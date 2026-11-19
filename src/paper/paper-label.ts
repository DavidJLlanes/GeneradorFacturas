import type { Page } from '../core/document/types';
import { matchPreset } from './match-preset';
import { orientationOf } from './orientation';

const nf = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });

// Texto corto del papel actual, p. ej. "A4 vertical", "Ticket 80 mm · 200 mm de largo" o "210 × 297 mm".
export function paperLabel(page: Page): string {
  const preset = matchPreset(page);
  if (!preset) return `${nf.format(page.widthMm)} × ${nf.format(page.heightMm)} mm`;
  if (preset.continuous) return `${preset.name} · ${nf.format(page.heightMm)} mm de largo`;
  if (page.widthMm === page.heightMm) return preset.name;
  return `${preset.name} ${orientationOf(page) === 'landscape' ? 'horizontal' : 'vertical'}`;
}
