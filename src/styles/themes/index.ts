import { samePalette, type Palette } from '../palette';
import { THEMES, type Theme } from './themes';

export { THEMES, type Theme };

export const themeById = (id: string): Theme | undefined => THEMES.find((t) => t.id === id);

// Tema cuya paleta coincide exactamente con la dada (null si se ha ajustado a mano).
export const matchTheme = (palette: Palette): Theme | null =>
  THEMES.find((t) => samePalette(t.palette, palette)) ?? null;
