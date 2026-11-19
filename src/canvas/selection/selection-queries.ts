import { rectOf } from '../../core/document/element-rect';
import type { DocElement, DocumentModel } from '../../core/document/types';
import { unionRect, type Rect } from '../../core/geometry/rect';

// Elementos de la selección que se pueden mover o redimensionar.
export function transformableElements(doc: DocumentModel, ids: readonly string[]): DocElement[] {
  const sel = new Set(ids);
  return doc.elements.filter((e) => sel.has(e.id) && !e.locked && !e.hidden);
}

export function boundsOf(elements: readonly DocElement[]): Rect | null {
  return unionRect(elements.map(rectOf));
}
