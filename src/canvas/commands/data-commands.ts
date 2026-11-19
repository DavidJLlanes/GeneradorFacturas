import type { DataSchema, DocumentData, LineRow } from '../../core/document-type/types';
import type { Editor } from '../editor/create-editor';

export type DataValue = string | number | readonly LineRow[] | undefined;

// Fija un dato del documento. Los datos no entran en el historial de deshacer del diseño.
export function setDataValue(editor: Editor, key: string, value: DataValue): void {
  const current = editor.ui.get().data;
  if (current[key] === value) return;
  const next: Record<string, unknown> = { ...current };
  const empty = value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
  if (empty) delete next[key];
  else next[key] = value;
  editor.ui.update((s) => ({ ...s, data: next }));
}

// Indica de dónde salen los datos del documento: el esquema y los cálculos de su tipo.
export function setDataSource(
  editor: Editor,
  source: { schema: DataSchema | null; compute?: (data: DocumentData) => DocumentData },
): void {
  editor.ui.update((s) => ({ ...s, schema: source.schema, compute: source.compute ?? null }));
}

export function toggleFillMode(editor: Editor): void {
  editor.ui.update((s) => ({ ...s, fillMode: !s.fillMode }));
}
