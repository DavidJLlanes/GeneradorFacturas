import { describe, expect, it } from 'vitest';
import {
  footerBlock,
  linesTable,
  numberBlock,
  partyBlock,
  signatureBlock,
  totalsBlock,
} from './blocks';
import { DEFAULT_THEME as t } from './pieces';

describe('bloques de plantilla', () => {
  it('partyBlock apila rótulo, nombre y detalles sin solaparse', () => {
    const [label, name, details] = partyBlock(
      'c',
      [10, 70, 90],
      { label: 'Cliente', name: '{{a}}', details: ['x', 'y'], detailsH: 16 },
      t,
    );
    expect(label?.props['text']).toBe('CLIENTE');
    expect(name?.y).toBe(75);
    expect(details?.y).toBe(82);
    expect(details?.props['text']).toBe('x\ny');
    expect(partyBlock('c', [0, 0, 5], { name: 'n', details: [], detailsH: 1 }, t)).toHaveLength(2);
  });

  it('el número y el pie se repiten en cada página', () => {
    expect(numberBlock([0, 0, 1, 1], 'Nº {{n}}', t).repeat).toBe(true);
    expect(numberBlock([0, 0, 1, 1], 'Nº {{n}}', t, false).repeat).toBeUndefined();
    expect(footerBlock([0, 0, 1, 1], 'x', t).repeat).toBe(true);
  });

  it('la firma lleva su rótulo encima del recuadro', () => {
    const [caption, box] = signatureBlock('f', [10, 100, 50, 20], 'Firma', t);
    expect(caption?.y).toBe(94);
    expect(box?.kind).toBe('shape');
  });

  it('totales y tabla usan solo colores de la paleta', () => {
    const totals = totalsBlock([0, 0, 1, 1], ['A | {{a}}', 'B | {{b}}'], t);
    expect(totals.props['rows']).toBe('A | {{a}}\nB | {{b}}');
    expect(linesTable([0, 0, 1, 1], t, 5, 'items').props).toMatchObject({
      field: 'items',
      minRows: 5,
      headerFill: '@primary',
    });
  });
});
