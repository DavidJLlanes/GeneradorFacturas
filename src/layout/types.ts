import type { DocElement } from '../core/document/types';
import type { Rect } from '../core/geometry/rect';

// Reparto de un documento en páginas. Es independiente de la pantalla: lo usan la vista, la vista
// previa y, más adelante, el PDF.

/** Lo que una pieza reparable (una tabla) mide con los datos actuales. */
export interface Measure {
  /** Alto fijo que se repite al principio de cada trozo (cabecera de la tabla), en mm. */
  headMm: number;
  /** Alto de cada unidad repartible (cada fila), en mm. Una unidad nunca se parte. */
  unitsMm: readonly number[];
}

/** Trozo de una pieza reparable: unidades `from` (incluida) a `to` (excluida). */
export interface Slice {
  from: number;
  to: number;
}

export type MeasureFn = (element: DocElement) => Measure | null;

/** Una pieza colocada en una página, con su posición y alto reales. */
export interface PlacedItem {
  element: DocElement;
  rect: Rect;
  /** Solo en piezas repartidas entre páginas. */
  slice?: Slice;
}

export interface PageLayout {
  items: readonly PlacedItem[];
}

export interface Layout {
  pages: readonly PageLayout[];
}
