import type { Palette } from '../../styles/palette';
import type { Rect } from '../geometry/rect';

// Márgenes en mm: delimitan la zona de seguridad de impresión.
export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Page {
  widthMm: number;
  heightMm: number;
  marginsMm: Margins;
}

// Propiedades de una pieza: valores simples, serializables a JSON.
export type PropValue = string | number | boolean;
export type PieceProps = Readonly<Record<string, PropValue>>;

// Elemento genérico de la pizarra. El orden en `elements` es el orden de apilado (el último, encima).
export interface DocElement extends Rect {
  id: string;
  name: string;
  locked: boolean;
  hidden: boolean;
  /** Se repite en todas las páginas, en su misma posición (cabeceras, pies, membretes). */
  repeat?: boolean;
  /** Tipo de pieza (id de una carpeta de `src/pieces/`). */
  kind: string;
  props: PieceProps;
}

export interface DocumentModel {
  page: Page;
  elements: readonly DocElement[];
  /** Colores con nombre del documento; si falta, se usa la paleta por defecto. */
  palette?: Palette;
}
