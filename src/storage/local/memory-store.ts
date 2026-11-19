import type { RecordStore, SavedRecord } from './record';

// Almacén en memoria: sirve en las pruebas y como respaldo si el navegador no deja usar IndexedDB
// (por ejemplo, en navegación privada); en ese caso nada sobrevive a cerrar la pestaña.
export function createMemoryStore(): RecordStore {
  const records = new Map<string, SavedRecord>();
  return {
    list: () => Promise.resolve([...records.values()]),
    get: (id) => Promise.resolve(records.get(id)),
    put: (record) => {
      records.set(record.id, structuredClone(record));
      return Promise.resolve();
    },
    delete: (id) => {
      records.delete(id);
      return Promise.resolve();
    },
    clear: () => {
      records.clear();
      return Promise.resolve();
    },
  };
}
