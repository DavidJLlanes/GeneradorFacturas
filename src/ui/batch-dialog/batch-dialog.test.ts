// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { buildTargets } from '../../batch/targets/build-targets';
import { exampleCsv } from '../../batch/targets/example-csv';
import { documentTypes } from '../../core/document-type/discover';

describe('CSV de ejemplo de cada tipo', () => {
  it('todos los tipos dan cabeceras y una fila del mismo largo', () => {
    for (const type of documentTypes.list()) {
      const targets = buildTargets(type.schema);
      const { headers, row } = exampleCsv(targets, type.sampleData ?? null);
      expect(headers.length, type.id).toBe(targets.length);
      expect(row.length, type.id).toBe(headers.length);
    }
  });

  it('la factura da el importe en formato de hoja de cálculo', () => {
    const type = documentTypes.get('factura')!;
    const { headers, row } = exampleCsv(buildTargets(type.schema), type.sampleData ?? null);
    expect(row[headers.indexOf('Fecha de expedición')]).toBe('19/11/2026');
    expect(row[headers.findIndex((h) => h.includes('Precio'))]).toBe('850,00');
  });
});
