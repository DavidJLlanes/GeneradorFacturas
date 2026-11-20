import type { Target } from './build-targets';

// Asignación de columnas del CSV (por posición) a destinos. Falta = sin columna.
export type Mapping = Readonly<Record<string, number>>;

const normalize = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

// Empareja cada destino con la cabecera que se llama igual (sin acentos ni mayúsculas) a su etiqueta
// o a su clave. Una columna se usa como mucho una vez.
export function autoMap(headers: readonly string[], targets: readonly Target[]): Mapping {
  const heads = headers.map(normalize);
  const used = new Set<number>();
  const mapping: Record<string, number> = {};
  for (const target of targets) {
    const names = [
      target.label,
      target.columnKey ? `${target.fieldKey} ${target.columnKey}` : target.fieldKey,
      target.columnKey ?? '',
    ]
      .map(normalize)
      .filter(Boolean);
    const index = heads.findIndex((h, i) => !used.has(i) && names.includes(h));
    if (index !== -1) {
      mapping[target.id] = index;
      used.add(index);
    }
  }
  return mapping;
}
