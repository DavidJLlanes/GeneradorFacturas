import { describe, expect, it } from 'vitest';
import { compute, lineNet, orderNumber } from './calc';
import { sampleData } from './sample';

describe('cálculos', () => {
  it('importe de línea en céntimos', () => {
    expect(lineNet({ cantidad: 3, precio: 4500 })).toBe(13500);
    expect(lineNet({})).toBe(0);
  });

  it('número con prefijo y serie opcional', () => {
    expect(orderNumber({ numero: 7 })).toBe('PC-0007');
    expect(orderNumber({ serie: 'A', numero: 7 })).toBe('A/PC-0007');
    expect(orderNumber({ numero: 0 })).toBe('');
  });

  it('IVA por tipo sobre la suma de bases, solo de los tipos usados', () => {
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
    expect(out['total']).toBe(20230);
  });

  it('los datos de muestra dan un total coherente y su número', () => {
    const out = compute(sampleData);
    expect(out['total']).toBe((out['baseTotal'] as number) + (out['ivaTotal'] as number));
    expect(out['numeroPedido']).toBe('PC-0018');
  });
});
