import type { DocumentData } from '../../core/document-type/types';
import type { DesignFile } from '../design-file/format';

// Lo que se guarda en el navegador (IndexedDB): el diseño completo, los datos y una miniatura.
export const RECORD_VERSION = 1;

export type RecordKind = 'actual' | 'plantilla';

export interface SavedRecord {
  id: string;
  version: number;
  kind: RecordKind;
  tipoDocumento: string;
  nombre: string;
  actualizado: string;
  /** Miniatura como dirección de datos (`data:image/svg+xml,…`). */
  miniatura: string;
  diseno: DesignFile;
  datos: DocumentData;
}

// Almacén de registros. La versión real usa IndexedDB; las pruebas, una en memoria.
export interface RecordStore {
  list(): Promise<readonly SavedRecord[]>;
  get(id: string): Promise<SavedRecord | undefined>;
  put(record: SavedRecord): Promise<void>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}

export const currentId = (typeId: string): string => `actual:${typeId}`;
