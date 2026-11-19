import type { DataSchema, DocumentData, LineRow } from '../../core/document-type/types';
import type { Editor } from '../editor/create-editor';

export type DataValue = string | number | boolean | readonly LineRow[] | undefined;

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
  source: {
    schema: DataSchema | null;
    compute?: (data: DocumentData) => DocumentData;
    sample?: DocumentData;
  },
): void {
  editor.ui.update((s) => ({
    ...s,
    schema: source.schema,
    compute: source.compute ?? null,
    sample: source.sample ?? null,
  }));
}

// Rellena el documento con los datos de muestra del tipo y pasa a verlo relleno.
export function loadSampleData(editor: Editor): void {
  const sample = editor.ui.get().sample;
  if (sample)
    editor.ui.update((s) => ({ ...s, data: sample, fillMode: true, selection: [], pageIndex: 0 }));
}

export function clearData(editor: Editor): void {
  editor.ui.update((s) => ({ ...s, data: {} }));
}

export function toggleFillMode(editor: Editor): void {
  // La vista con datos no se edita: al entrar se suelta la selección y se vuelve a la primera página.
  editor.ui.update((s) => ({ ...s, fillMode: !s.fillMode, selection: [], pageIndex: 0 }));
}
