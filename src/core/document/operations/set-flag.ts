import type { DocumentModel } from '../types';

export type ElementFlag = 'locked' | 'hidden' | 'repeat';

export function setElementsFlag(
  doc: DocumentModel,
  ids: readonly string[],
  flag: ElementFlag,
  value: boolean,
): DocumentModel {
  const target = new Set(ids);
  return {
    ...doc,
    elements: doc.elements.map((e) =>
      target.has(e.id) && (e[flag] ?? false) !== value ? { ...e, [flag]: value } : e,
    ),
  };
}
