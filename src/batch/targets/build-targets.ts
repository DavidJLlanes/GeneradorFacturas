import type { ChoiceOption, DataSchema, FieldKind } from '../../core/document-type/types';

// A qué se puede enviar una columna del CSV: un campo del tipo de documento o una columna de su
// tabla de líneas. Salen del esquema, así que cada tipo ofrece los suyos sin código propio.
export interface Target {
  id: string;
  label: string;
  kind: Exclude<FieldKind, 'lines'>;
  group: string;
  required: boolean;
  options?: readonly ChoiceOption[];
  /** Clave del campo (o del campo de líneas, si es una columna de línea). */
  fieldKey: string;
  /** Clave de la columna, solo en columnas de línea. */
  columnKey?: string;
}

export const fieldTargetId = (key: string): string => `campo:${key}`;
export const lineTargetId = (field: string, column: string): string => `linea:${field}.${column}`;

export function buildTargets(schema: DataSchema): Target[] {
  const targets: Target[] = [];
  for (const field of schema.fields) {
    if (field.computed || field.kind === 'image') continue;
    if (field.kind === 'lines') {
      for (const column of field.columns ?? []) {
        if (column.computed) continue;
        targets.push({
          id: lineTargetId(field.key, column.key),
          label: `${field.label}: ${column.label}`,
          kind: column.kind,
          group: field.label,
          required: false,
          ...(column.options ? { options: column.options } : {}),
          fieldKey: field.key,
          columnKey: column.key,
        });
      }
      continue;
    }
    targets.push({
      id: fieldTargetId(field.key),
      label: field.label,
      kind: field.kind,
      group: field.group,
      required: field.required === true,
      ...(field.options ? { options: field.options } : {}),
      fieldKey: field.key,
    });
  }
  // Si dos campos se llaman igual (p. ej. el nombre del emisor y el del cliente), se distinguen por su grupo.
  const count = new Map<string, number>();
  for (const t of targets) count.set(t.label, (count.get(t.label) ?? 0) + 1);
  return targets.map((t) =>
    (count.get(t.label) ?? 0) > 1 ? { ...t, label: `${t.group}: ${t.label}` } : t,
  );
}
