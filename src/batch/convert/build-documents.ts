import type { DocumentData, LineRow } from '../../core/document-type/types';
import type { Mapping } from '../targets/auto-map';
import type { Target } from '../targets/build-targets';
import { convertValue } from './convert-value';

export interface BatchDocument {
  /** Filas del CSV (la primera es la 2: la 1 son las cabeceras) de las que sale este documento. */
  rows: readonly number[];
  data: DocumentData;
  errors: readonly string[];
}

export interface BuildOptions {
  targets: readonly Target[];
  mapping: Mapping;
  /** Columna que agrupa filas consecutivas en un solo documento (p. ej. el número de factura). */
  groupColumn: number | null;
  /** Datos comunes a todos los documentos (p. ej. los del emisor); las columnas del CSV los pisan. */
  base?: DocumentData;
}

const cell = (row: readonly string[], index: number | undefined): string =>
  index === undefined || index < 0 ? '' : (row[index] ?? '');

// Convierte las filas del CSV en datos de documento. Los campos salen de la primera fila de cada
// documento; las columnas de línea, de todas sus filas (una línea por fila).
export function buildDocuments(
  rows: readonly (readonly string[])[],
  options: BuildOptions,
): BatchDocument[] {
  const { targets, mapping, groupColumn, base = {} } = options;
  const scalars = targets.filter((t) => !t.columnKey);
  const lineTargets = targets.filter((t) => t.columnKey);

  const groups: { rows: number[]; first: readonly string[] }[] = [];
  let lastKey: string | null = null;
  rows.forEach((row, i) => {
    const key = groupColumn === null ? null : cell(row, groupColumn).trim();
    const merge = key !== null && key !== '' && key === lastKey && groups.length > 0;
    if (merge) groups[groups.length - 1]!.rows.push(i);
    else groups.push({ rows: [i], first: row });
    lastKey = key;
  });

  return groups.map((group) => {
    const data: Record<string, unknown> = { ...base };
    const errors: string[] = [];
    const line = (n: number): string => `fila ${n + 2}`;

    for (const target of scalars) {
      const result = convertValue(target, cell(group.first, mapping[target.id]));
      if (result === null) {
        if (target.required && (base[target.fieldKey] ?? '') === '')
          errors.push(`${line(group.rows[0]!)}: falta «${target.label}»`);
      } else if ('error' in result)
        errors.push(`${line(group.rows[0]!)}: ${target.label}: ${result.error}`);
      else data[target.fieldKey] = result.value;
    }

    const lines = new Map<string, LineRow[]>();
    for (const n of group.rows) {
      const row = rows[n]!;
      const built = new Map<string, Record<string, string | number>>();
      for (const target of lineTargets) {
        const result = convertValue(target, cell(row, mapping[target.id]));
        if (result === null) continue;
        if ('error' in result) {
          errors.push(`${line(n)}: ${target.label}: ${result.error}`);
          continue;
        }
        const entry = built.get(target.fieldKey) ?? {};
        entry[target.columnKey!] = typeof result.value === 'boolean' ? '' : result.value;
        built.set(target.fieldKey, entry);
      }
      for (const [field, entry] of built) lines.set(field, [...(lines.get(field) ?? []), entry]);
    }
    for (const [field, list] of lines) data[field] = list;
    return { rows: group.rows.map((n) => n + 2), data, errors };
  });
}
