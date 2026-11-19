import type { Rect } from '../../geometry/rect';
import { newId } from '../ids';
import type { DocElement, DocumentModel } from '../types';

export function addElement(
  doc: DocumentModel,
  rect: Rect,
  name: string,
): { doc: DocumentModel; id: string } {
  const element: DocElement = { id: newId(), name, locked: false, hidden: false, ...rect };
  return { doc: { ...doc, elements: [...doc.elements, element] }, id: element.id };
}
