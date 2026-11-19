import { rectOf } from '../../core/document/element-rect';
import type { DocElement, DocumentModel } from '../../core/document/types';
import { pointInRect, type Point } from '../../core/geometry/rect';

// Elemento más alto bajo un punto de la página (mm). Ignora ocultos y bloqueados.
export function hitTestElement(doc: DocumentModel, p: Point): DocElement | null {
  for (let i = doc.elements.length - 1; i >= 0; i--) {
    const e = doc.elements[i];
    if (e && !e.hidden && !e.locked && pointInRect(p, rectOf(e))) return e;
  }
  return null;
}
