import type { RecordStore } from '../local/record';

// Contexto de la sesión: tipo de documento abierto y almacén local. Se fija una vez al arrancar y lo
// usan los diálogos de archivo, para no pasarlo por todas las capas de la interfaz.
export interface Session {
  typeId: string;
  store: RecordStore;
}

let current: Session | null = null;

export const setSession = (session: Session): void => {
  current = session;
};

export function getSession(): Session {
  if (!current) throw new Error('La sesión no está iniciada.');
  return current;
}
