import type { ColumnSpec, DataSchema, LineRow } from '../../core/document-type/types';
import type { PieceProps } from '../../core/document/types';
import { num, str } from '../shared/props';

export interface TableData {
  columns: readonly ColumnSpec[];
  /** Filas de datos más las vacías hasta llegar al mínimo de filas. */
  rows: readonly LineRow[];
  rowHeightMm: number;
}

// Columnas y filas de una tabla: las columnas salen del campo de líneas del esquema y las filas, de los
// datos. Sin datos (plantilla limpia) solo hay filas vacías para ver el diseño. Null si falta el campo.
export function tableData(
  props: PieceProps,
  schema: DataSchema | null,
  value: (key: string) => unknown,
): TableData | null {
  const field = schema?.fields.find((f) => f.key === str(props, 'field') && f.kind === 'lines');
  if (!field?.columns || field.columns.length === 0) return null;
  const raw = value(field.key);
  const data: readonly LineRow[] = Array.isArray(raw) ? (raw as LineRow[]) : [];
  const empty = Math.max(0, Math.round(num(props, 'minRows')) - data.length);
  return {
    columns: field.columns,
    rows: [...data, ...Array.from({ length: empty }, (): LineRow => ({}))],
    rowHeightMm: Math.max(num(props, 'rowHeight'), 2),
  };
}
