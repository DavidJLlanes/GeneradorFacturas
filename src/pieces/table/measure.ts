import type { Measure } from '../../layout/types';
import type { PieceMeasureInput } from '../types';
import { tableData } from './table-rows';

// Qué mide la tabla con los datos actuales: una cabecera fija y una unidad por fila.
export function measureTable({ props, schema, value }: PieceMeasureInput): Measure | null {
  const data = tableData(props, schema, value);
  if (!data) return null;
  return { headMm: data.rowHeightMm, unitsMm: data.rows.map(() => data.rowHeightMm) };
}
