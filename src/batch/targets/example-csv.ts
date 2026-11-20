import type { DocumentData } from '../../core/document-type/types';
import { centsToInput } from '../../data/money';
import { formatFieldValue } from '../../data/format-field';
import type { Target } from './build-targets';

// Texto de un dato de muestra como lo escribiría una persona en la hoja de cálculo.
function asCell(target: Target, value: unknown): string {
  if (typeof value === 'number' && target.kind === 'money') return centsToInput(value);
  if (typeof value === 'number') return String(value).replace('.', ',');
  return formatFieldValue(target.kind, value, target.options);
}

// Cabeceras y una fila de ejemplo para el CSV de partida (con la primera línea de cada tabla).
export function exampleCsv(
  targets: readonly Target[],
  sample: DocumentData | null,
): { headers: string[]; row: string[] } {
  const data = sample ?? {};
  return {
    headers: targets.map((t) => t.label),
    row: targets.map((t) => {
      if (!t.columnKey) return asCell(t, data[t.fieldKey]);
      const lines = data[t.fieldKey];
      const first = Array.isArray(lines)
        ? (lines[0] as Record<string, unknown> | undefined)
        : undefined;
      return asCell(t, first?.[t.columnKey]);
    }),
  };
}
