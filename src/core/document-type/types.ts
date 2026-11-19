import type { DocumentModel } from '../document/types';

// Contrato que cumple cada tipo de documento (factura, presupuesto, albarán…).
// Un tipo vive entero en `src/documents/<tipo>/` y exporta su definición por defecto.

export type FieldKind =
  'text' | 'multiline' | 'number' | 'money' | 'date' | 'image' | 'lines' | 'choice' | 'toggle';

// Opción de un campo o columna de tipo 'choice'. Se guarda `value`; se muestra `label`.
export interface ChoiceOption {
  value: string;
  label: string;
}

// Columna de un campo de tipo 'lines' (tabla de líneas: conceptos, cantidades, precios…).
export type ColumnKind = 'text' | 'number' | 'money' | 'choice';

export interface ColumnSpec {
  key: string;
  label: string;
  kind: ColumnKind;
  /** Anchura relativa respecto a las demás columnas. */
  width: number;
  /** Para 'choice': las opciones; la primera es la de las líneas nuevas. */
  options?: readonly ChoiceOption[];
  /** Calculada por el tipo (en `compute`): no se edita a mano. */
  computed?: boolean;
}

// Una línea de la tabla: valores por clave de columna. Los importes van en céntimos.
export type LineRow = Readonly<Record<string, string | number>>;

export interface FieldSpec {
  /** Clave con puntos, usada en variables: `cliente.nombre` → `{{cliente.nombre}}`. */
  key: string;
  label: string;
  kind: FieldKind;
  /** Bloque del panel de datos al que pertenece (p. ej. "Cliente"). */
  group: string;
  required?: boolean;
  /** Solo para 'lines': las columnas de la tabla. */
  columns?: readonly ColumnSpec[];
  /** Solo para 'choice': las opciones. */
  options?: readonly ChoiceOption[];
  /** Calculado por el tipo: se muestra y se puede usar en variables, pero no se edita. */
  computed?: boolean;
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
  /** Tipo interno (de prueba o de ejemplo): no se ofrece al abrir la aplicación. */
  internal?: boolean;
  /** Papel con el que arranca un diseño nuevo (id del catálogo de `paper/`). */
  defaultPaperId: string;
  numbering: Numbering;
  schema: DataSchema;
  /** Textos propios del tipo, por clave. */
  labels: Readonly<Record<string, string>>;
  /** Datos de muestra para ver el diseño relleno (botón "Datos de ejemplo"). */
  sampleData?: DocumentData;
  /** Plantillas de partida; la primera es la que se abre por defecto. */
  templates: readonly DocumentTemplate[];
  /** Valores derivados de los datos (totales, impuestos…). Opcional: un albarán puede no tenerlos. */
  compute?: (data: DocumentData) => DocumentData;
}
