import type { DocumentTemplate, DocumentTypeDefinition } from '../core/document-type/types';
import { registerCustomFont } from '../fonts/custom/custom-fonts';
import type { RecordStore, SavedRecord } from '../storage/local/record';
import { loadCurrent } from '../storage/local/records';

// Sesión guardada del tipo (diseño y datos del último uso), lista para reabrir al entrar. Si la
// dirección pide una plantilla concreta (`#plantilla=…`), manda la dirección y no se restaura nada.
export async function restoreSession(
  store: RecordStore,
  type: DocumentTypeDefinition,
  hash: string,
): Promise<SavedRecord | undefined> {
  if (new URLSearchParams(hash.replace(/^#/, '')).has('plantilla')) return undefined;
  const record = await loadCurrent(store, type.id).catch(() => undefined);
  if (!record) return undefined;
  for (const font of record.diseno.fuentes) registerCustomFont(font);
  return record;
}

export const templateOf = (record: SavedRecord): DocumentTemplate => ({
  id: 'guardado',
  name: record.nombre,
  document: record.diseno.documento,
});
