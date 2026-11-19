import type { DocumentData } from '../../core/document-type/types';
import { migrateTo } from '../design-file/migrate';

// Archivo de datos: lo que se ha rellenado (cliente, líneas…), aparte del diseño. Extensión `.datos.json`.
export const DATA_FORMAT = 'generador-documentos/datos';
export const DATA_VERSION = 1;
export const DATA_EXTENSION = '.datos.json';

export interface DataFile {
  formato: typeof DATA_FORMAT;
  version: number;
  tipoDocumento: string;
  guardado: string;
  datos: DocumentData;
}

export function buildDataFile(data: DocumentData, typeId: string): DataFile {
  return {
    formato: DATA_FORMAT,
    version: DATA_VERSION,
    tipoDocumento: typeId,
    guardado: new Date().toISOString(),
    datos: data,
  };
}

export const dataToJson = (file: DataFile): string => JSON.stringify(file, null, 1);

export function parseDataFile(text: string): DataFile {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('Este archivo no son datos válidos (no se puede leer).');
  }
  if (
    typeof raw !== 'object' ||
    raw === null ||
    (raw as Record<string, unknown>)['formato'] !== DATA_FORMAT
  ) {
    throw new Error('Este archivo no es un archivo de datos de Generador de documentos.');
  }
  const file = migrateTo(raw as Record<string, unknown>, DATA_VERSION);
  const { tipoDocumento, datos, guardado } = file;
  const valid = typeof datos === 'object' && datos !== null && !Array.isArray(datos);
  if (typeof tipoDocumento !== 'string' || !valid) throw new Error('Los datos están dañados.');
  return {
    formato: DATA_FORMAT,
    version: DATA_VERSION,
    tipoDocumento,
    guardado: typeof guardado === 'string' ? guardado : new Date().toISOString(),
    datos: datos as DocumentData,
  };
}
