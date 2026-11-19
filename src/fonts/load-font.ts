import { fontById } from './catalog';
import { customFontById, customFontFaceCss, isCustomFontId } from './custom/custom-fonts';
import { fontFaceCss } from './font-faces';

const loaded = new Set<string>();

// Carpeta de las fuentes, respetando la ruta base de la aplicación (p. ej. `/factura/`).
const baseUrl = (): string => `${import.meta.env.BASE_URL}fonts/`;

// Declara las reglas de una fuente la primera vez que se usa. Es barato y se puede llamar en cada
// dibujo: el navegador no descarga ningún archivo hasta que un texto lo necesita.
export function ensureFont(id: string): void {
  if (!id || loaded.has(id)) return;
  const custom = isCustomFontId(id) ? customFontById(id) : undefined;
  const font = custom ? undefined : fontById(id);
  const css = custom ? customFontFaceCss(custom) : font ? fontFaceCss(font, baseUrl()) : null;
  if (css === null) return;
  loaded.add(id);
  const style = document.createElement('style');
  style.dataset.font = id;
  style.textContent = css;
  document.head.append(style);
}
