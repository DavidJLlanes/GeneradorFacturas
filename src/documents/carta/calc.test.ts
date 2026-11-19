import { describe, expect, it } from 'vitest';
import { addDays, compute } from './calc';
import { sampleData } from './sample';

describe('carta de reclamación', () => {
  it('suma días cruzando mes y año, y rechaza fechas no válidas', () => {
    expect(addDays('2026-11-19', 15)).toBe('2026-12-04');
    expect(addDays('2026-12-20', 15)).toBe('2027-01-04');
    expect(addDays('19/11/2026', 5)).toBe('');
  });

  it('la fecha límite solo existe con fecha y plazo', () => {
    expect(compute(sampleData)).toEqual({ fechaLimite: '2026-12-04' });
    expect(compute({ fecha: '2026-11-19' })).toEqual({});
    expect(compute({ plazoDias: 10 })).toEqual({});
  });
});
