import { rectOf } from '../../core/document/element-rect';
import type { DocumentModel } from '../../core/document/types';
import { rectsIntersect, type Rect } from '../../core/geometry/rect';

// Ids de los elementos seleccionables que toca el rectángulo de selección.
export function elementsInRect(doc: DocumentModel, rect: Rect): string[] {
  return doc.elements
    .filter((e) => !e.hidden && !e.locked && rectsIntersect(rect, rectOf(e)))
    .map((e) => e.id);
}
