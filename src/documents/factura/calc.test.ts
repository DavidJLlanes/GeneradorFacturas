import { describe, expect, it } from 'vitest';
import { compute, invoiceNumber, lineNet } from './calc';
import { sampleData } from './sample';

const line = (iva: string, cantidad: number, precio: number, descuento?: number) => ({
  concepto: 'x',
  cantidad,
  precio,
  iva,
  ...(descuento === undefined ? {} : { descuento }),
});

describe('líneas', () => {
  it('importe neto = cantidad × precio menos descuento, en céntimos', () => {
    expect(lineNet({ cantidad: 3, precio: 4500, descuento: 10 })).toBe(12150);
    expect(lineNet({ cantidad: 1.5, precio: 333 })).toBe(500);
    expect(lineNet({ cantidad: 2, precio: 1000, descuento: 150 })).toBe(0);
    expect(lineNet({})).toBe(0);
  });
});

describe('número de factura', () => {
  it('con y sin serie, y vacío si falta el número', () => {
    expect(invoiceNumber({ serie: 'A', numero: 7 })).toBe('A/0007');
    expect(invoiceNumber({ serie: ' 2026 ', numero: 12 })).toBe('2026/0012');
    expect(invoiceNumber({ numero: 7 })).toBe('0007');
    expect(invoiceNumber({ numero: 0 })).toBe('');
    expect(invoiceNumber({})).toBe('');
    expect(invoiceNumber({ numero: 123456 })).toBe('123456');
  });
});

describe('totales de la factura', () => {
  it('IVA por tipo, IRPF y total con los datos de muestra', () => {
    const out = compute(sampleData);
    expect(out).toMatchObject({
      numeroFactura: 'A/0007',
      base21: 97150,
      iva21: 20402,
      base4: 3600,
      iva4: 144,
      baseTotal: 100750,
      ivaTotal: 20546,
      irpfCuota: 15113,
      total: 106183,
    });
    expect((out['lineas'] as { importe: number }[]).map((l) => l.importe)).toEqual([
      85000, 12150, 3600,
    ]);
  });

  it('los tipos sin líneas no generan valores (para ocultar sus filas)', () => {
    const out = compute(sampleData);
    for (const key of [
      'base10',
      'iva10',
      'base0',
      'iva0',
      'baseExenta',
      'recargoTotal',
      'menciones',
    ]) {
      expect(out[key], key).toBeUndefined();
    }
  });

  it('recargo de equivalencia: 5,2 / 1,4 / 0,5 % sobre cada base', () => {
    const out = compute({
      lineas: [line('21', 1, 10000), line('10', 1, 10000), line('4', 1, 10000)],
      recargo: true,
    });
    expect(out).toMatchObject({ rec21: 520, rec10: 140, rec4: 50, recargoTotal: 710 });
    expect(out['total']).toBe(30000 + 2100 + 1000 + 400 + 710);
  });

  it('sin recargo activado no aparece aunque haya líneas', () => {
    expect(compute({ lineas: [line('21', 1, 10000)] })['recargoTotal']).toBeUndefined();
  });

  it('el tipo 0 % no genera cuota ni recargo, pero sí base', () => {
    const out = compute({ lineas: [line('0', 1, 5000)], recargo: true });
    expect(out).toMatchObject({ base0: 5000, iva0: 0, total: 5000 });
    expect(out['recargoTotal']).toBeUndefined();
  });

  it('las líneas exentas no llevan IVA y añaden la mención legal', () => {
    const out = compute({ lineas: [line('E', 2, 2500), line('21', 1, 1000)] });
    expect(out).toMatchObject({
      baseExenta: 5000,
      base21: 1000,
      iva21: 210,
      baseTotal: 6000,
      total: 6210,
    });
    expect(out['menciones']).toMatch(/exenta/i);
    const custom = compute({ lineas: [line('E', 1, 100)], motivoExencion: ' Art. 20 LIVA ' });
    expect(custom['menciones']).toBe('Art. 20 LIVA');
  });

  it('IRPF: se calcula sobre la base total, se resta y se limita a 0–100 %', () => {
    expect(compute({ lineas: [line('21', 1, 10000)], irpf: 7 })).toMatchObject({
      irpfCuota: 700,
      total: 10000 + 2100 - 700,
    });
    expect(compute({ lineas: [line('21', 1, 10000)], irpf: 0 })['irpfCuota']).toBeUndefined();
    expect(compute({ lineas: [line('21', 1, 10000)], irpf: -5 })['irpfCuota']).toBeUndefined();
    expect(compute({ lineas: [line('21', 1, 10000)], irpf: 500 })['irpfCuota']).toBe(10000);
  });

  it('un tipo de IVA desconocido cuenta como 21 %', () => {
    expect(compute({ lineas: [{ cantidad: 1, precio: 1000, iva: '99' }] })).toMatchObject({
      base21: 1000,
      iva21: 210,
    });
    expect(compute({ lineas: [{ cantidad: 1, precio: 1000 }] })).toMatchObject({ base21: 1000 });
  });

  it('sin líneas todo es cero y no falla', () => {
    expect(compute({})).toMatchObject({
      lineas: [],
      baseTotal: 0,
      ivaTotal: 0,
      total: 0,
      numeroFactura: '',
    });
  });

  it('no acumula errores de coma flotante con muchas líneas', () => {
    const lineas = Array.from({ length: 30 }, () => line('21', 1, 10));
    expect(compute({ lineas })).toMatchObject({ baseTotal: 300, iva21: 63, total: 363 });
  });
});
