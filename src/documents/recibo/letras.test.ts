import { describe, expect, it } from 'vitest';
import { centsInWords } from './letras';

describe('importe en letra', () => {
  it.each([
    [100, 'un euro'],
    [1, 'un céntimo'],
    [150, 'un euro con cincuenta céntimos'],
    [2100, 'veintiún euros'],
    [3100, 'treinta y un euros'],
    [2500, 'veinticinco euros'],
    [10000, 'cien euros'],
    [10100, 'ciento un euros'],
    [123456, 'mil doscientos treinta y cuatro euros con cincuenta y seis céntimos'],
    [100000, 'mil euros'],
    [2100000, 'veintiún mil euros'],
    [8000000, 'ochenta mil euros'],
    [100000000, 'un millón de euros'],
    [200000000, 'dos millones de euros'],
    [
      123456789,
      'un millón doscientos treinta y cuatro mil quinientos sesenta y siete euros con ochenta y nueve céntimos',
    ],
    [2000000100, 'veinte millones un euros'],
    [99, 'noventa y nueve céntimos'],
    [101, 'un euro con un céntimo'],
  ])('%i céntimos → %s', (cents, words) => {
    expect(centsInWords(cents)).toBe(words);
  });

  it('sin importe, negativo o fuera de rango no escribe nada', () => {
    expect(centsInWords(0)).toBe('');
    expect(centsInWords(-5)).toBe('');
    expect(centsInWords(Number.NaN)).toBe('');
    expect(centsInWords(100_000_000_000)).toBe('');
  });
});
