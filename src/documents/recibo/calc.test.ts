import { describe, expect, it } from 'vitest';
import { compute, receiptNumber } from './calc';
import { sampleData } from './sample';

describe('recibo', () => {
  it('número con prefijo R-', () => {
    expect(receiptNumber({ numero: 45 })).toBe('R-0045');
    expect(receiptNumber({})).toBe('');
  });

  it('escribe el importe en letra solo cuando hay importe', () => {
    expect(compute({ importe: 150 })['importeLetras']).toBe('un euro con cincuenta céntimos');
    expect(compute({})).not.toHaveProperty('importeLetras');
  });

  it('los datos de muestra dan número e importe en letra', () => {
    const out = compute(sampleData);
    expect(out['numeroRecibo']).toBe('R-0045');
    expect(String(out['importeLetras'])).toContain('mil doscientos treinta y cuatro euros');
  });
});
