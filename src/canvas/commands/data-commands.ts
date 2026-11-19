import type { DataSchema } from '../../core/document-type/types';
import type { Editor } from '../editor/create-editor';

// Fija un dato del documento. Los datos no entran en el historial de deshacer del diseño.
export function setDataValue(
  editor: Editor,
  key: string,
  value: string | number | undefined,
): void {
  const current = editor.ui.get().data;
  if (current[key] === value) return;
  const next = { ...current };
  if (value === undefined || value === '') delete next[key];
  else next[key] = value;
  editor.ui.update((s) => ({ ...s, data: next }));
}

export function setSchema(editor: Editor, schema: DataSchema | null): void {
  editor.ui.update((s) => ({ ...s, schema }));
}

export function toggleFillMode(editor: Editor): void {
  editor.ui.update((s) => ({ ...s, fillMode: !s.fillMode }));
}
