import type { Rect } from '../../geometry/rect';
import { newId } from '../ids';
import type { DocElement, DocumentModel, PieceProps } from '../types';

export interface NewPiece {
  kind: string;
  props: PieceProps;
}

export function addElement(
  doc: DocumentModel,
  rect: Rect,
  name: string,
  piece: NewPiece = { kind: 'shape', props: {} },
): { doc: DocumentModel; id: string } {
  const element: DocElement = {
    id: newId(),
    name,
    locked: false,
    hidden: false,
    ...piece,
    ...rect,
  };
  return { doc: { ...doc, elements: [...doc.elements, element] }, id: element.id };
}
