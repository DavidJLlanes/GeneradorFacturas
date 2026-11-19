import type { PieceProps } from '../core/document/types';
import type { PropSpec } from '../pieces/types';
import { PALETTE_KEYS, type Palette, type PaletteKey } from './palette';

// Un color enlazado a la paleta se guarda como `@nombre` (p. ej. `@primary`).
const TOKEN = /^@(\w+)$/;

export const tokenOf = (key: PaletteKey): string => `@${key}`;

export function paletteKeyOf(value: unknown): PaletteKey | null {
  const name = typeof value === 'string' ? TOKEN.exec(value)?.[1] : undefined;
  return PALETTE_KEYS.find((key) => key === name) ?? null;
}

// Color real de un valor: el de la paleta si está enlazado; si no, el valor tal cual.
export function resolveColor(value: string, palette: Palette): string {
  const key = paletteKeyOf(value);
  return key ? palette[key] : value;
}

// Propiedades con sus colores enlazados ya sustituidos. Devuelve el mismo objeto si no había ninguno.
export function resolveColorProps(
  props: PieceProps,
  specs: readonly PropSpec[],
  palette: Palette,
): PieceProps {
  let out: Record<string, string | number | boolean> | null = null;
  for (const spec of specs) {
    const value = props[spec.key];
    if (spec.kind !== 'color' || typeof value !== 'string') continue;
    const real = resolveColor(value, palette);
    if (real === value) continue;
    out ??= { ...props };
    out[spec.key] = real;
  }
  return out ?? props;
}
