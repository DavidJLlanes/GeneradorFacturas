import { newId } from '../ids';
import type { DocumentModel } from '../types';

// Las copias se colocan encima de todo, desplazadas, y conservan el orden relativo.
export function duplicateElements(
  doc: DocumentModel,
  ids: readonly string[],
  offsetMm = 5,
): { doc: DocumentModel; newIds: string[] } {
  const source = new Set(ids);
  const copies = doc.elements
    .filter((e) => source.has(e.id))
    .map((e) => ({
      ...e,
      id: newId(),
      name: `${e.name} copia`,
      x: e.x + offsetMm,
      y: e.y + offsetMm,
      locked: false,
    }));
  return {
    doc: { ...doc, elements: [...doc.elements, ...copies] },
    newIds: copies.map((c) => c.id),
  };
}
