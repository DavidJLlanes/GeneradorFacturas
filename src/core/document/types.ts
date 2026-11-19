import type { Rect } from '../geometry/rect';

export interface Page {
  widthMm: number;
  heightMm: number;
}

// Elemento genérico de la pizarra. El orden en `elements` es el orden de apilado (el último, encima).
export interface DocElement extends Rect {
  id: string;
  name: string;
  locked: boolean;
  hidden: boolean;
}

export interface DocumentModel {
  page: Page;
  elements: readonly DocElement[];
}
