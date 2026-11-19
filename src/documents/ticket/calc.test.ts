import { describe, expect, it } from 'vitest';
import { compute, lineTotal, ticketNumber, vatIncluded } from './calc';
import { sampleData } from './sample';

describe('ticket', () => {
  it('número de 6 cifras con prefijo T', () => {
    expect(ticketNumber({ numero: 42 })).toBe('T000042');
    expect(ticketNumber({})).toBe('');
  });

  it('importe de línea en céntimos', () => {
    expect(lineTotal({ cantidad: 2, precio: 180 })).toBe(360);
    expect(lineTotal({})).toBe(0);
  });

  it('extrae el IVA contenido en un total con IVA incluido', () => {
    expect(vatIncluded(1210, 21)).toBe(210);
    expect(vatIncluded(1100, 10)).toBe(100);
    expect(vatIncluded(1000, 0)).toBe(0);
  });

  it('total e IVA incluido de los datos de muestra', () => {
    const out = compute(sampleData);
    expect(out['total']).toBe(960);
    expect(out['ivaIncluido']).toBe(87);
    expect(out['numeroTicket']).toBe('T000042');
  });

  it('con IVA 0 % no hay fila de IVA incluido', () => {
    expect(compute({ iva: '0', lineas: [{ cantidad: 1, precio: 100 }] })).not.toHaveProperty(
      'ivaIncluido',
    );
  });
});
