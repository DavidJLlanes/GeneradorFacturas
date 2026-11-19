import { describe, expect, it } from 'vitest';
import type { DocElement } from '../../core/document/types';
import { alignElements } from './align';
import { distributeElements } from './distribute';

const el = (id: string, x: number, y: number, w: number, h: number): DocElement => ({
  id,
  name: id,
  x,
  y,
  w,
  h,
  locked: false,
  hidden: false,
  kind: 'shape',
  props: {},
});

describe('alinear', () => {
  const items = [el('a', 10, 10, 20, 10), el('b', 50, 40, 10, 30)];
  const ref = { x: 10, y: 10, w: 50, h: 60 };

  it('alinea a los bordes y centros de la referencia', () => {
    expect(alignElements(items, 'left', ref).get('b')?.x).toBe(10);
    expect(alignElements(items, 'right', ref).get('a')?.x).toBe(40);
    expect(alignElements(items, 'hcenter', ref).get('a')?.x).toBe(25);
    expect(alignElements(items, 'top', ref).get('b')?.y).toBe(10);
    expect(alignElements(items, 'bottom', ref).get('a')?.y).toBe(60);
    expect(alignElements(items, 'vmiddle', ref).get('b')?.y).toBe(25);
  });

  it('no cambia tamaño ni el eje contrario', () => {
    const a = alignElements(items, 'left', ref).get('a');
    expect(a).toEqual({ x: 10, y: 10, w: 20, h: 10 });
  });
});

describe('distribuir', () => {
  it('reparte huecos iguales en horizontal', () => {
    const items = [el('a', 0, 0, 10, 10), el('b', 15, 0, 10, 10), el('c', 90, 0, 10, 10)];
    const out = distributeElements(items, 'horizontal');
    expect(out.get('a')?.x).toBe(0);
    expect(out.get('b')?.x).toBe(45);
    expect(out.get('c')?.x).toBe(90);
  });

  it('reparte en vertical aunque vengan desordenados', () => {
    const items = [el('c', 0, 100, 10, 10), el('a', 0, 0, 10, 20), el('b', 0, 30, 10, 10)];
    const out = distributeElements(items, 'vertical');
    expect(out.get('b')?.y).toBe(55); // huecos de 35 entre 0–20, 55–65 y 100–110
  });

  it('necesita al menos tres elementos', () => {
    expect(distributeElements([el('a', 0, 0, 1, 1), el('b', 5, 0, 1, 1)], 'horizontal').size).toBe(
      0,
    );
  });
});
