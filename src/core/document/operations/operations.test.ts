import { describe, expect, it } from 'vitest';
import { createPage } from '../page';
import type { DocElement, DocumentModel } from '../types';
import { addElement } from './add-element';
import { duplicateElements } from './duplicate-elements';
import { removeElements } from './remove-elements';
import { moveBackward, moveForward, moveToBack, moveToFront } from './reorder';
import { setElementsFlag } from './set-flag';
import { applyRects } from './update-rects';

const el = (id: string, x = 0): DocElement => ({
  id,
  name: id,
  x,
  y: 0,
  w: 10,
  h: 10,
  locked: false,
  hidden: false,
  kind: 'shape',
  props: {},
});

const docOf = (...ids: string[]): DocumentModel => ({
  page: createPage(210, 297),
  elements: ids.map((id) => el(id)),
});

const order = (d: DocumentModel) => d.elements.map((e) => e.id).join('');

describe('operaciones de documento', () => {
  it('añade y elimina elementos', () => {
    const { doc, id } = addElement(docOf('a'), { x: 1, y: 2, w: 3, h: 4 }, 'Caja');
    expect(doc.elements).toHaveLength(2);
    expect(doc.elements[1]).toMatchObject({ id, name: 'Caja', x: 1, y: 2, w: 3, h: 4 });
    expect(removeElements(doc, [id]).elements).toHaveLength(1);
  });

  it('duplica con desplazamiento, nuevo id y encima de todo', () => {
    const { doc, newIds } = duplicateElements(docOf('a', 'b'), ['a']);
    expect(newIds).toHaveLength(1);
    const copy = doc.elements[2]!;
    expect(copy.id).toBe(newIds[0]);
    expect(copy.id).not.toBe('a');
    expect(copy).toMatchObject({ name: 'a copia', x: 5, y: 5 });
  });

  it('cambia banderas solo en los elementos indicados', () => {
    const d = docOf('a', 'b');
    const out = setElementsFlag(d, ['a'], 'locked', true);
    expect(out.elements[0]!.locked).toBe(true);
    expect(out.elements[1]).toBe(d.elements[1]);
  });

  it('aplica rectángulos nuevos y devuelve el mismo documento si no hay cambios', () => {
    const d = docOf('a', 'b');
    expect(applyRects(d, new Map())).toBe(d);
    const out = applyRects(d, new Map([['b', { x: 7, y: 8, w: 9, h: 10 }]]));
    expect(out.elements[1]).toMatchObject({ x: 7, y: 8, w: 9, h: 10 });
    expect(out.elements[0]).toBe(d.elements[0]);
  });

  it('reordena: al frente, al fondo, adelante y atrás', () => {
    const d = docOf('a', 'b', 'c', 'd');
    expect(order(moveToFront(d, ['a']))).toBe('bcda');
    expect(order(moveToBack(d, ['d', 'c']))).toBe('cdab');
    expect(order(moveForward(d, ['a', 'b']))).toBe('cabd');
    expect(order(moveBackward(d, ['c', 'd']))).toBe('acdb');
  });

  it('no cambia nada si ya está en el límite', () => {
    const d = docOf('a', 'b');
    expect(moveToFront(d, ['b'])).toBe(d);
    expect(moveForward(d, ['b'])).toBe(d);
    expect(moveBackward(d, ['a'])).toBe(d);
  });
});
