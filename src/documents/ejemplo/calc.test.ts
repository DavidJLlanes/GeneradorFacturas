import { describe, expect, it } from 'vitest';
import { compute } from './calc';

describe('cálculos del tipo ejemplo', () => {
  it('calcula importes, subtotal, IVA y total en céntimos', () => {
    const out = compute({
      lineas: [
        { concepto: 'A', cantidad: 2, precio: 1000 },
        { concepto: 'B', cantidad: 1.5, precio: 333 },
      ],
    });
    expect((out['lineas'] as { importe: number }[]).map((l) => l.importe)).toEqual([2000, 500]);
    expect(out).toMatchObject({ subtotal: 2500, iva: 525, total: 3025 });
  });

  it('sin líneas todo es cero y no falla', () => {
    expect(compute({})).toMatchObject({ lineas: [], subtotal: 0, iva: 0, total: 0 });
    expect(compute({ lineas: [{ concepto: 'x' }] })).toMatchObject({ subtotal: 0 });
  });

  it('no suma con errores de coma flotante', () => {
    const lineas = Array.from({ length: 10 }, () => ({ cantidad: 1, precio: 10 }));
    expect(compute({ lineas })).toMatchObject({ subtotal: 100 });
  });
});
