import type { DataSchema, DocumentData } from '../core/document-type/types';
import { fakeValue, type FakeContext } from './fake-values';
import type { Rng } from './rng';

// Datos ficticios completos para un esquema: un valor plausible por cada campo editable. Es
// genérico: no conoce ningún tipo, solo los tipos de campo y los nombres habituales (`nombre`,
// `nif`, `direccion`…). Un tipo puede afinar el resultado con su propio `refineRandomData`.
export function generateData(schema: DataSchema, rng: Rng, today = new Date()): DocumentData {
  const ctx: FakeContext = { rng, today, names: new Map() };
  const out: Record<string, unknown> = {};
  for (const field of schema.fields) {
    const value = fakeValue(field, ctx);
    if (value !== undefined) out[field.key] = value;
  }
  return out;
}
