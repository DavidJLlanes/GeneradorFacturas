import data from './catalog.json';
import { isCustomFontId } from './custom/custom-fonts';

// Catálogo de fuentes alojadas en nuestro servidor (`public/fonts/`, generado por
// `scripts/build-fonts.mjs` a partir de este mismo catálogo). Añadir una fuente: instalar su paquete
// `@fontsource/<id>` y añadir una entrada a `catalog.json`.

export type FontCategory = 'sans' | 'serif' | 'mono' | 'display' | 'script';

/** Estilos disponibles: peso 400 o 700, con `i` si es cursiva (p. ej. `700i`). */
export type FontStyleId = '400' | '400i' | '700' | '700i';

export interface FontEntry {
  id: string;
  name: string;
  category: FontCategory;
  styles: readonly FontStyleId[];
}

export const FONTS: readonly FontEntry[] = data as readonly FontEntry[];

export const CATEGORY_LABELS: Readonly<Record<FontCategory, string>> = {
  sans: 'Sin serifa',
  serif: 'Con serifa',
  mono: 'Monoespaciada',
  display: 'Titulares',
  script: 'Manuscrita',
};

const FALLBACK: Readonly<Record<FontCategory, string>> = {
  sans: 'system-ui, sans-serif',
  serif: 'Georgia, serif',
  mono: 'ui-monospace, monospace',
  display: 'Impact, sans-serif',
  script: 'cursive',
};

export const fontById = (id: string): FontEntry | undefined => FONTS.find((f) => f.id === id);

// Valor de `font-family` para una fuente del catálogo; sin id (o desconocido) se hereda la del sistema.
export function fontStack(id: string): string {
  if (isCustomFontId(id)) return `"${id}", sans-serif`;
  const font = fontById(id);
  return font ? `"${font.name}", ${FALLBACK[font.category]}` : 'inherit';
}
