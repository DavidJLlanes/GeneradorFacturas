import type { DocElement, PieceProps } from '../document/types';

// Ayudantes genéricos para escribir plantillas de cualquier tipo de documento. No saben nada de un
// tipo concreto: solo construyen elementos del documento.

/** Caja en mm: x, y, anchura, altura. */
export type Box = readonly [x: number, y: number, w: number, h: number];

/** Colores de una plantilla, siempre enlazados a la paleta (`@primary`…). */
export interface Theme {
  accent: string;
  ink: string;
  muted: string;
  soft: string;
}

export const DEFAULT_THEME: Theme = {
  accent: '@primary',
  ink: '@text',
  muted: '@muted',
  soft: '@soft',
};

export const piece = (
  id: string,
  name: string,
  kind: string,
  [x, y, w, h]: Box,
  props: PieceProps = {},
): DocElement => ({ id, name, kind, props, x, y, w, h, locked: false, hidden: false });

export const text = (id: string, name: string, box: Box, props: PieceProps): DocElement =>
  piece(id, name, 'text', box, props);

const TEXT_KINDS = new Set(['text', 'header', 'footer', 'table', 'totals']);

// Pone la misma fuente del catálogo a todas las piezas con texto de una plantilla.
export const withFont = (elements: readonly DocElement[], fontFamily: string): DocElement[] =>
  elements.map((el) =>
    TEXT_KINDS.has(el.kind) ? { ...el, props: { fontFamily, ...el.props } } : el,
  );

// Marca una pieza para repetirse en todas las páginas.
export const repeating = (el: DocElement): DocElement => ({ ...el, repeat: true });

// Línea horizontal de acento.
export const rule = (id: string, box: Box, color: string): DocElement =>
  piece(id, 'Separador', 'line', box, { color });

// Recuadro vacío con borde (firmas, sellos, casillas para rellenar a mano).
export const frame = (id: string, name: string, box: Box, stroke: string): DocElement =>
  piece(id, name, 'shape', box, { filled: false, bordered: true, stroke, strokeWidth: 0.3 });
