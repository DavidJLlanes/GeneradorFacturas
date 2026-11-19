import type { DocumentModel, PieceProps } from '../types';

// Cambia propiedades de varias piezas a la vez. Si no cambia nada, devuelve el mismo documento.
export function updateProps(
  doc: DocumentModel,
  ids: readonly string[],
  patch: PieceProps,
): DocumentModel {
  const target = new Set(ids);
  const keys = Object.keys(patch);
  let changed = false;
  const elements = doc.elements.map((e) => {
    if (!target.has(e.id) || keys.every((k) => e.props[k] === patch[k])) return e;
    changed = true;
    return { ...e, props: { ...e.props, ...patch } };
  });
  return changed ? { ...doc, elements } : doc;
}
