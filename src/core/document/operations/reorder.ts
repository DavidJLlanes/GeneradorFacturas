import type { DocElement, DocumentModel } from '../types';

// Si el orden no cambia se devuelve el mismo documento, para no crear entradas de historial vacías.
function withOrder(doc: DocumentModel, elements: readonly DocElement[]): DocumentModel {
  return elements.every((e, i) => e === doc.elements[i]) ? doc : { ...doc, elements };
}

export function moveToFront(doc: DocumentModel, ids: readonly string[]): DocumentModel {
  const sel = new Set(ids);
  return withOrder(doc, [
    ...doc.elements.filter((e) => !sel.has(e.id)),
    ...doc.elements.filter((e) => sel.has(e.id)),
  ]);
}

export function moveToBack(doc: DocumentModel, ids: readonly string[]): DocumentModel {
  const sel = new Set(ids);
  return withOrder(doc, [
    ...doc.elements.filter((e) => sel.has(e.id)),
    ...doc.elements.filter((e) => !sel.has(e.id)),
  ]);
}

export function moveForward(doc: DocumentModel, ids: readonly string[]): DocumentModel {
  const sel = new Set(ids);
  const els = [...doc.elements];
  for (let i = els.length - 2; i >= 0; i--) {
    const a = els[i];
    const b = els[i + 1];
    if (a && b && sel.has(a.id) && !sel.has(b.id)) {
      els[i] = b;
      els[i + 1] = a;
    }
  }
  return withOrder(doc, els);
}

export function moveBackward(doc: DocumentModel, ids: readonly string[]): DocumentModel {
  const sel = new Set(ids);
  const els = [...doc.elements];
  for (let i = 1; i < els.length; i++) {
    const a = els[i - 1];
    const b = els[i];
    if (a && b && sel.has(b.id) && !sel.has(a.id)) {
      els[i - 1] = b;
      els[i] = a;
    }
  }
  return withOrder(doc, els);
}
