import type { DocumentModel } from '../../core/document/types';

// Quita de la selección los ids que ya no existen. Devuelve el mismo array si no cambia nada.
export function pruneSelection(doc: DocumentModel, ids: readonly string[]): readonly string[] {
  if (ids.length === 0) return ids;
  const existing = new Set(doc.elements.map((e) => e.id));
  const kept = ids.filter((id) => existing.has(id));
  return kept.length === ids.length ? ids : kept;
}

export function toggleId(ids: readonly string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
}

export function mergeIds(a: readonly string[], b: readonly string[]): string[] {
  return [...a, ...b.filter((id) => !a.includes(id))];
}
