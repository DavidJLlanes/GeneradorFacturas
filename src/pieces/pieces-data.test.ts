// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import type { DataSchema } from '../core/document-type/types';
import { makeResolver } from '../data/make-resolver';
import { pieces } from './discover';
import { qrMatrix } from './qr/encode';

const schema: DataSchema = {
  version: 1,
  fields: [
    {
      key: 'lineas',
      label: 'Líneas',
      kind: 'lines',
      group: 'g',
      columns: [
        { key: 'concepto', label: 'Concepto', kind: 'text', width: 4 },
        { key: 'cantidad', label: 'Cant.', kind: 'number', width: 1 },
        { key: 'precio', label: 'Precio', kind: 'money', width: 2 },
      ],
    },
    { key: 'total', label: 'Total', kind: 'money', group: 'g', computed: true },
  ],
};

const draw = (
  kind: string,
  props: Record<string, string | number | boolean>,
  data: Record<string, unknown> = {},
  fill = true,
): HTMLElement => {
  const node = document.createElement('div');
  const piece = pieces.get(kind)!;
  const resolve = fill ? makeResolver(schema, data) : (t: string): string => t;
  piece.render(node, {
    props: { ...piece.defaultProps, ...props },
    widthMm: 100,
    heightMm: 60,
    resolve,
    schema,
    value: (key) => (fill ? data[key] : undefined),
  });
  return node;
};

describe('QR', () => {
  it('genera una matriz cuadrada y rechaza texto vacío', () => {
    const m = qrMatrix('https://djl.com.es', 'M')!;
    expect(m.length).toBeGreaterThanOrEqual(21);
    expect(m.every((row) => row.length === m.length)).toBe(true);
    expect(m.flat().some(Boolean)).toBe(true);
    expect(qrMatrix('', 'M')).toBeNull();
  });

  it('admite UTF-8 y un nivel de corrección más alto crea una matriz mayor o igual', () => {
    expect(qrMatrix('León · 20 €', 'L')).not.toBeNull();
    expect(qrMatrix('x'.repeat(200), 'H')!.length).toBeGreaterThanOrEqual(
      qrMatrix('x'.repeat(200), 'L')!.length,
    );
  });

  it('un texto demasiado largo no rompe: se muestra el marcador', () => {
    expect(qrMatrix('x'.repeat(5000), 'H')).toBeNull();
    expect(draw('qr', { content: 'x'.repeat(5000) }).textContent).toBe('QR');
  });

  it('dibuja un único trazo con las variables resueltas', () => {
    const node = draw('qr', { content: '{{total}}' }, { total: 12100 });
    expect(node.querySelectorAll('path').length).toBe(1);
    expect(node.querySelector('svg')?.getAttribute('viewBox')).toMatch(/^0 0 \d+ \d+$/);
  });
});

describe('tabla de líneas', () => {
  it('con datos muestra cabecera y filas formateadas', () => {
    const node = draw(
      'table',
      { minRows: 0 },
      { lineas: [{ concepto: 'Diseño', cantidad: 2, precio: 5000 }] },
    );
    const texts = [...node.children].map((c) => c.textContent);
    expect(texts.slice(0, 3)).toEqual(['Concepto', 'Cant.', 'Precio']);
    expect(texts[3]).toBe('Diseño');
    expect(texts[4]).toBe('2');
    expect(texts[5]).toContain('50,00');
    expect(node.style.gridTemplateColumns).toBe('4fr 1fr 2fr');
  });

  it('la plantilla limpia dibuja las filas mínimas vacías', () => {
    const node = draw('table', { minRows: 3 }, { lineas: [{ concepto: 'x' }] }, false);
    expect(node.children.length).toBe(3 + 3 * 3);
    expect(node.textContent).not.toContain('x');
  });

  it('avisa si el campo no es de líneas', () => {
    expect(draw('table', { field: 'total' }).textContent).toMatch(/elige un campo/);
  });

  it('las filas alternas y la rejilla se aplican', () => {
    const node = draw('table', { minRows: 2, zebra: true, grid: 'full' });
    const firstBody = node.children[3] as HTMLElement;
    const secondRowCell = node.children[6] as HTMLElement;
    expect(firstBody.style.borderBottom).toMatch(/solid/);
    expect(secondRowCell.style.background).not.toBe('transparent');
  });
});

describe('totales', () => {
  it('muestra etiqueta y valor resuelto, y destaca la última fila', () => {
    const node = draw(
      'totals',
      { rows: 'Base | {{total}}\nTotal | {{total}}\n\n' },
      { total: 12100 },
    );
    const cells = [...node.children] as HTMLElement[];
    expect(cells.length).toBe(4);
    expect(cells[0]?.textContent).toBe('Base');
    expect(cells[1]?.textContent).toContain('121,00');
    expect(cells[2]?.style.fontWeight).toBe('700');
    expect(cells[0]?.style.fontWeight).toBe('');
  });

  it('en plantilla limpia deja las variables y tolera filas sin separador', () => {
    const node = draw('totals', { rows: 'Solo etiqueta\nTotal | {{total}}' }, { total: 1 }, false);
    expect([...node.children].map((c) => c.textContent)).toEqual([
      'Solo etiqueta',
      '',
      'Total',
      '{{total}}',
    ]);
  });
});
