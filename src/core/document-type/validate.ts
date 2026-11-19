import { presetById } from '../../paper/paper-presets';
import { MAX_PAGE_MM, MIN_PAGE_MM } from '../../paper/size-limits';
import type { DocumentTypeDefinition, FieldSpec } from './types';

const ID_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const KEY_PATTERN = /^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)*$/;
const FIELD_KINDS = ['text', 'multiline', 'number', 'money', 'date', 'image', 'lines'];
const COLUMN_KINDS = ['text', 'number', 'money'];

type Report = (message: string) => number;

function validateColumns(
  field: string,
  columns: NonNullable<FieldSpec['columns']>,
  bad: Report,
): void {
  if (columns.length === 0) bad(`el campo de líneas "${field}" necesita columnas`);
  const keys = columns.map((c) => c.key);
  for (const key of keys.filter((k, i) => keys.indexOf(k) !== i)) {
    bad(`columna repetida en "${field}": "${key}"`);
  }
  for (const c of columns) {
    if (!KEY_PATTERN.test(c.key) || c.key.includes('.'))
      bad(`clave de columna inválida en "${field}": "${c.key}"`);
    if (!COLUMN_KINDS.includes(c.kind))
      bad(`tipo de columna desconocido en "${field}": "${c.kind}"`);
    if (!c.label.trim()) bad(`la columna "${c.key}" de "${field}" necesita etiqueta`);
    if (!(c.width > 0)) bad(`la columna "${c.key}" de "${field}" necesita anchura positiva`);
  }
}

const duplicates = (values: readonly string[]): string[] =>
  values.filter((v, i) => values.indexOf(v) !== i);

// Comprueba que una definición cumple el contrato. Devuelve la lista de problemas (vacía = válida).
export function validateDocumentType(def: DocumentTypeDefinition, folder: string): string[] {
  const errors: string[] = [];
  const bad = (message: string): number => errors.push(message);

  if (!ID_PATTERN.test(def.id)) bad(`id inválido: "${def.id}"`);
  if (def.id !== folder) bad(`el id "${def.id}" no coincide con la carpeta "${folder}"`);
  if (!def.name.trim()) bad('falta el nombre');
  if (!def.description.trim()) bad('falta la descripción');
  if (!presetById(def.defaultPaperId))
    bad(`papel por defecto desconocido: "${def.defaultPaperId}"`);

  const { prefix, padding } = def.numbering;
  if (!/^[A-Za-z0-9-]*$/.test(prefix)) bad(`prefijo de numeración inválido: "${prefix}"`);
  if (!Number.isInteger(padding) || padding < 1 || padding > 10)
    bad('padding de numeración fuera de 1–10');

  if (!Number.isInteger(def.schema.version) || def.schema.version < 1)
    bad('versión de esquema inválida');
  const keys = def.schema.fields.map((f) => f.key);
  for (const key of keys) if (!KEY_PATTERN.test(key)) bad(`clave de campo inválida: "${key}"`);
  for (const key of duplicates(keys)) bad(`clave de campo repetida: "${key}"`);
  for (const f of def.schema.fields) {
    if (!FIELD_KINDS.includes(f.kind)) bad(`tipo de campo desconocido en "${f.key}": "${f.kind}"`);
    if (!f.label.trim() || !f.group.trim()) bad(`el campo "${f.key}" necesita etiqueta y grupo`);
    if (f.kind !== 'lines' && f.columns)
      bad(`el campo "${f.key}" tiene columnas pero no es de líneas`);
    if (f.kind === 'lines') validateColumns(f.key, f.columns ?? [], bad);
  }

  if (def.templates.length === 0) bad('necesita al menos una plantilla');
  for (const id of duplicates(def.templates.map((t) => t.id))) bad(`plantilla repetida: "${id}"`);
  for (const t of def.templates) {
    const { widthMm, heightMm } = t.document.page;
    const inRange = (v: number): boolean => v >= MIN_PAGE_MM && v <= MAX_PAGE_MM;
    if (!inRange(widthMm) || !inRange(heightMm))
      bad(`la plantilla "${t.id}" tiene un papel fuera de rango`);
    const ids = t.document.elements.map((e) => e.id);
    for (const id of duplicates(ids)) bad(`la plantilla "${t.id}" repite el id de pieza "${id}"`);
  }

  return errors;
}
