import type { Editor } from '../../canvas/editor/create-editor';
import { newId } from '../../core/document/ids';
import { buildDesign } from '../design-file/build-design';
import type { DesignFile } from '../design-file/format';
import { applyDesign } from '../design-file/apply-design';
import { readDesign } from '../design-file/parse-design';
import { migrateTo } from '../design-file/migrate';
import {
  currentId,
  RECORD_VERSION,
  type RecordKind,
  type RecordStore,
  type SavedRecord,
} from './record';
import { thumbnailSvg } from './thumbnail';

// Registro del estado actual del editor (diseño + datos + miniatura).
export function snapshot(
  editor: Editor,
  typeId: string,
  name: string,
  kind: RecordKind,
  id: string,
): SavedRecord {
  const doc = editor.doc();
  return {
    id,
    version: RECORD_VERSION,
    kind,
    tipoDocumento: typeId,
    nombre: name,
    actualizado: new Date().toISOString(),
    miniatura: thumbnailSvg(doc),
    diseno: buildDesign(doc, typeId, name),
    datos: editor.ui.get().data,
  };
}

// Pasa un registro leído del almacén por la migración y la validación del diseño que lleva dentro.
export function readRecord(raw: SavedRecord): SavedRecord {
  const migrated = migrateTo(raw as unknown as Record<string, unknown>, RECORD_VERSION);
  const record = migrated as unknown as SavedRecord;
  return { ...record, diseno: readDesign(record.diseno) };
}

export const saveCurrent = (store: RecordStore, editor: Editor, typeId: string): Promise<void> =>
  store.put(snapshot(editor, typeId, 'Sesión actual', 'actual', currentId(typeId)));

export async function loadCurrent(
  store: RecordStore,
  typeId: string,
): Promise<SavedRecord | undefined> {
  const raw = await store.get(currentId(typeId));
  if (!raw) return undefined;
  try {
    return readRecord(raw);
  } catch {
    return undefined;
  }
}

export async function saveTemplate(
  store: RecordStore,
  editor: Editor,
  typeId: string,
  name: string,
): Promise<SavedRecord> {
  const record = snapshot(
    editor,
    typeId,
    name.trim() || 'Sin nombre',
    'plantilla',
    `plantilla:${newId()}`,
  );
  await store.put(record);
  return record;
}

// Plantillas guardadas con nombre, las más recientes primero.
export async function listTemplates(
  store: RecordStore,
  typeId?: string,
): Promise<readonly SavedRecord[]> {
  const all = await store.list();
  return all
    .filter((r) => r.kind === 'plantilla' && (typeId === undefined || r.tipoDocumento === typeId))
    .sort((a, b) => b.actualizado.localeCompare(a.actualizado));
}

// Abre una plantilla guardada: diseño y datos, como pasos que se pueden deshacer.
export function openRecord(editor: Editor, record: SavedRecord): void {
  const valid = readRecord(record);
  applyDesign(editor, valid.diseno);
  editor.ui.update((s) => ({ ...s, data: valid.datos }));
}

// Registro construido a partir de un archivo de diseño (sin pasar por el editor), con sus datos vacíos.
export const recordFromDesign = (file: DesignFile, kind: RecordKind, id: string): SavedRecord => ({
  id,
  version: RECORD_VERSION,
  kind,
  tipoDocumento: file.tipoDocumento,
  nombre: file.nombre,
  actualizado: new Date().toISOString(),
  miniatura: thumbnailSvg(file.documento),
  diseno: file,
  datos: {},
});
