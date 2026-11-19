import type { RecordStore, SavedRecord } from './record';

const DB_NAME = 'generador-documentos';
const STORE = 'registros';

const wrap = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Error de almacenamiento local.'));
  });

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('No se pudo abrir el almacenamiento.'));
  });
}

// Almacén de registros sobre IndexedDB: todo queda en este navegador, sin servidor.
export function createIdbStore(): RecordStore {
  let db: Promise<IDBDatabase> | null = null;
  const store = async (mode: IDBTransactionMode): Promise<IDBObjectStore> => {
    db ??= open();
    return (await db).transaction(STORE, mode).objectStore(STORE);
  };
  return {
    list: async () => (await wrap((await store('readonly')).getAll())) as SavedRecord[],
    get: async (id) => (await wrap((await store('readonly')).get(id))) as SavedRecord | undefined,
    put: async (record) => void (await wrap((await store('readwrite')).put(record))),
    delete: async (id) => void (await wrap((await store('readwrite')).delete(id))),
    clear: async () => void (await wrap((await store('readwrite')).clear())),
  };
}

// El mejor almacén disponible: IndexedDB si existe; si no, memoria.
export async function createBestStore(): Promise<RecordStore> {
  if (typeof indexedDB === 'undefined') return (await import('./memory-store')).createMemoryStore();
  const idb = createIdbStore();
  try {
    await idb.get('probe');
    return idb;
  } catch {
    return (await import('./memory-store')).createMemoryStore();
  }
}
