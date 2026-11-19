import { describe, expect, it } from 'vitest';
import { addDays, compute, lineNet, quoteNumber } from './calc';
import { sampleData } from './sample';

describe('líneas y número', () => {
  it('importe neto con descuento, en céntimos', () => {
    expect(lineNet({ cantidad: 5, precio: 3500, descuento: 10 })).toBe(15750);
    expect(lineNet({ cantidad: 2, precio: 1000, descuento: 150 })).toBe(0);
    expect(lineNet({})).toBe(0);
  });

  it('número con prefijo P- y serie opcional', () => {
    expect(quoteNumber({ numero: 12 })).toBe('P-0012');
    expect(quoteNumber({ serie: '2026', numero: 3 })).toBe('2026/P-0003');
    expect(quoteNumber({ numero: 0 })).toBe('');
  });
});

describe('validez', () => {
  it('suma días cruzando mes y año, y rechaza fechas no válidas', () => {
    expect(addDays('2026-11-19', 30)).toBe('2026-12-19');
    expect(addDays('2026-12-20', 15)).toBe('2027-01-04');
    expect(addDays('2028-02-20', 10)).toBe('2028-03-01');
    expect(addDays('', 5)).toBe('');
    expect(addDays('19/11/2026', 5)).toBe('');
  });

  it('«válido hasta» solo existe con fecha y días', () => {
    expect(compute({ fecha: '2026-11-19', validezDias: 30 })['validoHasta']).toBe('2026-12-19');
    expect(compute({ fecha: '2026-11-19' })).not.toHaveProperty('validoHasta');
    expect(compute({ validezDias: 30 })).not.toHaveProperty('validoHasta');
  });
});

describe('totales', () => {
  it('IVA por tipo sobre la suma de bases, y solo de los tipos usados', () => {
    const out = compute({
      lineas: [
        { cantidad: 1, precio: 10000, iva: '21' },
        { cantidad: 1, precio: 5000, iva: '21' },
        { cantidad: 1, precio: 2000, iva: '4' },
      ],
    });
    expect(out['baseTotal']).toBe(17000);
    expect(out['iva21']).toBe(3150);
    expect(out['iva4']).toBe(80);
    expect(out).not.toHaveProperty('iva10');
    expect(out['ivaTotal']).toBe(3230);
    expect(out['total']).toBe(20230);
  });

  it('sin líneas todo es cero y sin IVA 0 % suelto', () => {
    const out = compute({});
    expect(out['total']).toBe(0);
    expect(compute({ lineas: [{ cantidad: 1, precio: 100, iva: '0' }] })['total']).toBe(100);
  });

  it('los datos de muestra dan un total coherente', () => {
    const out = compute(sampleData);
    expect(out['total']).toBe((out['baseTotal'] as number) + (out['ivaTotal'] as number));
    expect(out['numeroPresupuesto']).toBe('P-0012');
    expect(out['validoHasta']).toBe('2026-12-19');
  });
});
