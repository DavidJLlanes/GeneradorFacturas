import type { DocElement } from '../document/types';
import { frame, piece, repeating, rule, text, type Box, type Theme } from './pieces';

// Bloques habituales de un documento comercial, ya con su aspecto. Reciben los textos y las
// variables que muestran, así que sirven a cualquier tipo. Los colores salen del tema (paleta).

export const logoBlock = (box: Box, field = 'emisor.logo'): DocElement =>
  piece('logo', 'Logo', 'image', box, { field });

export const titleBlock = (box: Box, title: string, t: Theme, fontSize = 28): DocElement =>
  text('titulo', 'Título', box, {
    text: title,
    fontSize,
    bold: true,
    align: 'right',
    color: t.accent,
  });

// Número del documento (por defecto se repite en todas las páginas).
export const numberBlock = (box: Box, content: string, t: Theme, repeat = true): DocElement => {
  const el = text('numero', 'Número', box, {
    text: content,
    fontSize: 13,
    align: 'right',
    color: t.ink,
  });
  return repeat ? repeating(el) : el;
};

// Líneas pequeñas alineadas a la derecha (fechas, referencias…).
export const metaBlock = (box: Box, lines: readonly string[], t: Theme): DocElement =>
  text('datos', 'Fechas y referencias', box, {
    text: lines.join('\n'),
    fontSize: 9,
    align: 'right',
    color: t.muted,
  });

export const captionBlock = (id: string, name: string, box: Box, label: string, t: Theme) =>
  text(id, name, box, { text: label.toUpperCase(), fontSize: 8, bold: true, color: t.accent });

// Persona o empresa: rótulo (opcional), nombre en negrita y líneas de detalle. `x`, `y` y `w` fijan
// el bloque; la altura de los detalles es `detailsH`.
export function partyBlock(
  id: string,
  [x, y, w]: readonly [number, number, number],
  party: { label?: string; name: string; details: readonly string[]; detailsH: number },
  t: Theme,
): DocElement[] {
  const out: DocElement[] = [];
  let top = y;
  if (party.label) {
    out.push(captionBlock(`${id}-rotulo`, `Rótulo ${id}`, [x, top, w, 5], party.label, t));
    top += 5;
  }
  out.push(
    text(`${id}-nombre`, `Nombre (${id})`, [x, top, w, 7], {
      text: party.name,
      fontSize: 12,
      bold: true,
      color: t.ink,
    }),
    text(`${id}-datos`, `Datos (${id})`, [x, top + 7, w, party.detailsH], {
      text: party.details.join('\n'),
      fontSize: 9,
      color: t.muted,
    }),
  );
  return out;
}

export const separator = (box: Box, t: Theme): DocElement => rule('separador', box, t.accent);

export const linesTable = (box: Box, t: Theme, minRows = 12, field = 'lineas'): DocElement =>
  piece('tabla', 'Líneas', 'table', box, {
    field,
    headerFill: t.accent,
    headerColor: '@onPrimary',
    zebraFill: t.soft,
    color: t.ink,
    minRows,
  });

// Bloque de totales: cada fila es "Etiqueta | {{variable}}"; la última se destaca. Las filas sin valor se omiten.
export const totalsBlock = (box: Box, rows: readonly string[], t: Theme): DocElement =>
  piece('totales', 'Totales', 'totals', box, {
    rows: rows.join('\n'),
    fontSize: 9.5,
    rowHeight: 5.5,
    color: t.ink,
    hideUnresolved: true,
    highlightLast: true,
    highlightFill: t.soft,
    ruleColor: t.accent,
  });

// Texto de apoyo (condiciones, notas, observaciones) con un rótulo opcional en mayúsculas.
export const noteBlock = (
  id: string,
  name: string,
  box: Box,
  body: readonly string[],
  t: Theme,
  heading?: string,
): DocElement =>
  text(id, name, box, {
    text: [...(heading ? [heading.toUpperCase()] : []), ...body].join('\n'),
    fontSize: 8.5,
    color: t.muted,
  });

// Recuadro de firma con su rótulo encima (el rótulo ocupa 6 mm por encima de `box`).
export const signatureBlock = (
  id: string,
  [x, y, w, h]: Box,
  label: string,
  t: Theme,
): DocElement[] => [
  captionBlock(`${id}-rotulo`, `Rótulo ${id}`, [x, y - 6, w, 5], label, t),
  frame(id, `Firma (${id})`, [x, y, w, h], t.muted),
];

// Pie que se repite en todas las páginas.
export const footerBlock = (box: Box, content: string, t: Theme): DocElement =>
  repeating(
    piece('pie', 'Pie', 'footer', box, { text: content, color: t.muted, ruleColor: t.accent }),
  );
