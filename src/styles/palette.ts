import type { DocumentModel } from '../core/document/types';

// Paleta del documento: unos pocos colores con nombre a los que las piezas se enlazan con `@nombre`.
// Cambiar la paleta (o elegir un tema) recolorea todas las piezas enlazadas a la vez.
export const PALETTE_KEYS = ['primary', 'text', 'muted', 'soft', 'line', 'onPrimary'] as const;

export type PaletteKey = (typeof PALETTE_KEYS)[number];
export type Palette = Readonly<Record<PaletteKey, string>>;

export const PALETTE_LABELS: Readonly<Record<PaletteKey, string>> = {
  primary: 'Color principal',
  text: 'Texto',
  muted: 'Texto secundario',
  soft: 'Fondo suave',
  line: 'Líneas',
  onPrimary: 'Texto sobre el principal',
};

export const DEFAULT_PALETTE: Palette = {
  primary: '#1f2937',
  text: '#111827',
  muted: '#4b5563',
  soft: '#f3f4f6',
  line: '#d1d5db',
  onPrimary: '#ffffff',
};

// Paleta de un documento; los que no la definen usan la de por defecto.
export const paletteOf = (doc: Pick<DocumentModel, 'palette'>): Palette =>
  doc.palette ?? DEFAULT_PALETTE;

export const samePalette = (a: Palette, b: Palette): boolean =>
  PALETTE_KEYS.every((key) => a[key] === b[key]);
