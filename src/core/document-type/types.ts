import type { DocumentModel } from '../document/types';

// Contrato que cumple cada tipo de documento (factura, presupuesto, albarán…).
// Un tipo vive entero en `src/documents/<tipo>/` y exporta su definición por defecto.

export type FieldKind = 'text' | 'multiline' | 'number' | 'money' | 'date' | 'image';

export interface FieldSpec {
  /** Clave con puntos, usada en variables: `cliente.nombre` → `{{cliente.nombre}}`. */
  key: string;
  label: string;
  kind: FieldKind;
  /** Bloque del panel de datos al que pertenece (p. ej. "Cliente"). */
  group: string;
  required?: boolean;
}

export interface DataSchema {
  /** Versión del esquema; sube cuando cambian los campos para poder migrar diseños antiguos. */
  version: number;
  fields: readonly FieldSpec[];
}

export type DocumentData = Readonly<Record<string, unknown>>;

export interface DocumentTemplate {
  id: string;
  name: string;
  document: DocumentModel;
}

export interface Numbering {
  prefix: string;
  /** Cifras mínimas del número, con ceros a la izquierda. */
  padding: number;
}

export interface DocumentTypeDefinition {
  /** Identificador en minúsculas y guiones; coincide con el nombre de su carpeta. */
  id: string;
  name: string;
  description: string;
  /** Papel con el que arranca un diseño nuevo (id del catálogo de `paper/`). */
  defaultPaperId: string;
  numbering: Numbering;
  schema: DataSchema;
  /** Textos propios del tipo, por clave. */
  labels: Readonly<Record<string, string>>;
  /** Plantillas de partida; la primera es la que se abre por defecto. */
  templates: readonly DocumentTemplate[];
  /** Valores derivados de los datos (totales, impuestos…). Opcional: un albarán puede no tenerlos. */
  compute?: (data: DocumentData) => DocumentData;
}
