import type { DocElement, DocumentModel } from '../../core/document/types';
import { DEFAULT_PALETTE } from '../../styles/palette';
import { resolveColor } from '../../styles/resolve-color';

const esc = (text: string): string => text.replace(/[&<>"']/g, '');

// Miniatura esquemática de un diseño: el papel con cada elemento como un bloque de color. No hace
// falta dibujar el documento real; basta para distinguir una plantilla de otra de un vistazo.
export function thumbnailSvg(doc: DocumentModel): string {
  const palette = doc.palette ?? DEFAULT_PALETTE;
  const color = (el: DocElement, key: string): string | null => {
    const value = el.props[key];
    return typeof value === 'string' && value !== '' ? esc(resolveColor(value, palette)) : null;
  };
  const parts: string[] = [];
  for (const el of doc.elements) {
    if (el.hidden) continue;
    const fill =
      el.props['filled'] === false ? null : (color(el, 'fill') ?? color(el, 'headerFill'));
    const text = color(el, 'color');
    const box = `x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}"`;
    if (fill) parts.push(`<rect ${box} fill="${fill}"/>`);
    else if (text) {
      const lines = Math.max(1, Math.min(4, Math.floor(el.h / 5)));
      for (let i = 0; i < lines; i += 1) {
        const w = el.w * (i === lines - 1 && lines > 1 ? 0.6 : 1);
        parts.push(
          `<rect x="${el.x}" y="${el.y + i * 4 + 1}" width="${w}" height="1.6" fill="${text}" opacity=".55"/>`,
        );
      }
    } else parts.push(`<rect ${box} fill="none" stroke="#9ca3af" stroke-width=".4"/>`);
  }
  const { widthMm: w, heightMm: h } = doc.page;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">` +
    `<rect width="${w}" height="${h}" fill="#fff"/>${parts.join('')}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
