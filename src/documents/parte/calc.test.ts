import { describe, expect, it } from 'vitest';
import { compute, duration, minutesOf, reportNumber } from './calc';
import { sampleData } from './sample';

describe('parte de trabajo', () => {
  it('número con prefijo PT-', () => {
    expect(reportNumber({ numero: 64 })).toBe('PT-0064');
    expect(reportNumber({})).toBe('');
  });

  it('lee horas válidas y rechaza las que no lo son', () => {
    expect(minutesOf('09:15')).toBe(555);
    expect(minutesOf('9:05')).toBe(545);
    expect(minutesOf('24:00')).toBeNull();
    expect(minutesOf('10:75')).toBeNull();
    expect(minutesOf('mediodía')).toBeNull();
    expect(minutesOf(undefined)).toBeNull();
  });

  it('calcula la duración, incluso pasando de medianoche', () => {
    expect(duration('09:15', '11:45')).toBe('2 h 30 min');
    expect(duration('10:00', '10:45')).toBe('45 min');
    expect(duration('08:00', '11:00')).toBe('3 h');
    expect(duration('22:00', '01:30')).toBe('3 h 30 min');
    expect(duration('10:00', '10:00')).toBe('0 min');
    expect(duration('10:00', '')).toBe('');
  });

  it('los datos de muestra dan número y duración; sin horas no hay duración', () => {
    expect(compute(sampleData)).toEqual({ numeroParte: 'PT-0064', duracion: '2 h 30 min' });
    expect(compute({})).not.toHaveProperty('duracion');
  });
});
