import { describe, expect, it } from 'vitest';
import { compute, engagementNumber } from './calc';
import { sampleData } from './sample';

describe('hoja de encargo', () => {
  it('número con prefijo HE-', () => {
    expect(engagementNumber({ numero: 5 })).toBe('HE-0005');
    expect(engagementNumber({})).toBe('');
  });

  it('pendiente = honorarios menos provisión, nunca negativo', () => {
    expect(compute(sampleData)['pendiente']).toBe(160000);
    expect(compute({ honorarios: 1000, provision: 5000 })['pendiente']).toBe(0);
    expect(compute({ honorarios: 1000 })['pendiente']).toBe(1000);
    expect(compute({ honorarios: 1000, provision: -50 })['pendiente']).toBe(1000);
  });

  it('sin honorarios no hay importe pendiente', () => {
    expect(compute({ provision: 500 })).not.toHaveProperty('pendiente');
  });
});
