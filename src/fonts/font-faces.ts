import type { FontEntry } from './catalog';
import { SUBSETS } from './subsets';

// Reglas `@font-face` de una fuente: un archivo por estilo y subconjunto. `baseUrl` es la carpeta
// donde están las fuentes (con barra final), p. ej. `/factura/fonts/`.
export function fontFaceCss(font: FontEntry, baseUrl: string): string {
  const rules: string[] = [];
  for (const style of font.styles) {
    const weight = style.replace('i', '');
    const kind = style.endsWith('i') ? 'italic' : 'normal';
    for (const subset of SUBSETS) {
      const file = `${font.id}/${font.id}-${subset.id}-${weight}-${kind}.woff2`;
      rules.push(
        `@font-face{font-family:"${font.name}";font-style:${kind};font-weight:${weight};` +
          `font-display:swap;src:url("${baseUrl}${file}") format("woff2");unicode-range:${subset.range}}`,
      );
    }
  }
  return rules.join('\n');
}
