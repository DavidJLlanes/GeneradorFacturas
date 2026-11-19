import { describe, expect, it } from 'vitest';
import { compute, voucherNumber } from './calc';
import { sampleData } from './sample';

describe('vale', () => {
  it('número con prefijo V-', () => {
    expect(voucherNumber({ numero: 9 })).toBe('V-0009');
    expect(voucherNumber({})).toBe('');
  });

  it('solo calcula el número completo', () => {
    expect(compute(sampleData)).toEqual({ numeroVale: 'V-0009' });
  });
});
