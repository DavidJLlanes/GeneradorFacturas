import type { Palette } from '../palette';

// Temas de partida: paletas completas entre las que elegir y que luego se pueden ajustar color a color.
export interface Theme {
  id: string;
  name: string;
  palette: Palette;
}

const theme = (
  id: string,
  name: string,
  [primary, text, muted, soft, line]: readonly [string, string, string, string, string],
): Theme => ({
  id,
  name,
  palette: { primary, text, muted, soft, line, onPrimary: '#ffffff' },
});

export const THEMES: readonly Theme[] = [
  theme('grafito', 'Grafito', ['#1f2937', '#111827', '#4b5563', '#f3f4f6', '#d1d5db']),
  theme('azul', 'Azul', ['#1d4ed8', '#0f172a', '#475569', '#eff6ff', '#bfdbfe']),
  theme('verde', 'Verde', ['#047857', '#0f1f1a', '#4b5f57', '#ecfdf5', '#a7d8c5']),
  theme('burdeos', 'Burdeos', ['#9f1239', '#1c1917', '#57534e', '#fff1f2', '#e7c4cc']),
  theme('ambar', 'Ámbar', ['#b45309', '#1c1917', '#57534e', '#fffbeb', '#e8d3a8']),
  theme('violeta', 'Violeta', ['#6d28d9', '#1e1b2e', '#555069', '#f5f3ff', '#d3c8f0']),
];
