import type { Margins, Page } from '../core/document/types';
import { clampMargins } from './margins';
import { orientationOf } from './orientation';
import type { PaperPreset } from './paper-presets';
import { clampPageSize } from './size-limits';

// Funciones puras que devuelven una página nueva a partir de la actual. No tocan el documento.

/** Cambia a un papel estándar conservando la orientación (salvo en largo continuo, siempre vertical). */
export function pageForPreset(current: Page, preset: PaperPreset): Page {
  const landscape = orientationOf(current) === 'landscape' && !preset.continuous;
  const widthMm = landscape ? preset.heightMm : preset.widthMm;
  const heightMm = landscape ? preset.widthMm : preset.heightMm;
  return { widthMm, heightMm, marginsMm: clampMargins(current.marginsMm, widthMm, heightMm) };
}

export function pageWithSize(current: Page, widthMm: number, heightMm: number): Page {
  const w = clampPageSize(widthMm);
  const h = clampPageSize(heightMm);
  return { widthMm: w, heightMm: h, marginsMm: clampMargins(current.marginsMm, w, h) };
}

export function pageWithMargins(current: Page, margins: Margins): Page {
  return { ...current, marginsMm: clampMargins(margins, current.widthMm, current.heightMm) };
}
