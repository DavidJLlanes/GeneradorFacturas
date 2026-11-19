import type { DocumentModel } from '../types';

export function removeElements(doc: DocumentModel, ids: readonly string[]): DocumentModel {
  const remove = new Set(ids);
  return { ...doc, elements: doc.elements.filter((e) => !remove.has(e.id)) };
}
