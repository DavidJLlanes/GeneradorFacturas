import { describe, expect, it } from 'vitest';
import { compute, deliveryNumber } from './calc';
import { sampleData } from './sample';
import definition from './index';

describe('albarán', () => {
  it('número con prefijo AL- y serie opcional', () => {
    expect(deliveryNumber({ numero: 31 })).toBe('AL-0031');
    expect(deliveryNumber({ serie: 'B', numero: 2 })).toBe('B/AL-0002');
    expect(deliveryNumber({})).toBe('');
  });

  it('suma las cantidades sin errores de coma flotante y no cuenta negativas', () => {
    const rows = [{ cantidad: 0.1 }, { cantidad: 0.2 }, { cantidad: -4 }, { cantidad: 'x' }];
    expect(compute({ lineas: rows })['totalUnidades']).toBe(0.3);
    expect(compute({})['totalUnidades']).toBe(0);
  });

  it('no calcula ningún importe: el albarán no lleva precios', () => {
    const out = compute(sampleData);
    expect(Object.keys(out).sort()).toEqual(['numeroAlbaran', 'totalUnidades']);
    expect(out['totalUnidades']).toBe(150.5);
  });

  it('su esquema no tiene campos de dinero', () => {
    const kinds = definition.schema.fields.map((f) => f.kind);
    expect(kinds).not.toContain('money');
  });
});
