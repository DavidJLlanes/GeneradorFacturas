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
