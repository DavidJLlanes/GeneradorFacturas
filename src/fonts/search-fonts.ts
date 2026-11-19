import { FONTS, type FontCategory, type FontEntry } from './catalog';

const plain = (text: string): string => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

// Fuentes cuyo nombre contiene la búsqueda (sin distinguir mayúsculas ni acentos), opcionalmente de una
// categoría. Mantiene el orden del catálogo.
export function searchFonts(query: string, category?: FontCategory): readonly FontEntry[] {
  const q = plain(query).trim();
  return FONTS.filter((f) => (!category || f.category === category) && plain(f.name).includes(q));
}
