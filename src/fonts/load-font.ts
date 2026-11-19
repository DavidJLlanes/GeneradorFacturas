import { fontById } from './catalog';
import { fontFaceCss } from './font-faces';

const loaded = new Set<string>();

// Carpeta de las fuentes, respetando la ruta base de la aplicación (p. ej. `/factura/`).
const baseUrl = (): string => `${import.meta.env.BASE_URL}fonts/`;

// Declara las reglas de una fuente la primera vez que se usa. Es barato y se puede llamar en cada
// dibujo: el navegador no descarga ningún archivo hasta que un texto lo necesita.
export function ensureFont(id: string): void {
  if (!id || loaded.has(id)) return;
  const font = fontById(id);
  if (!font) return;
  loaded.add(id);
  const style = document.createElement('style');
  style.dataset.font = id;
  style.textContent = fontFaceCss(font, baseUrl());
  document.head.append(style);
}
