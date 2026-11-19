import { describe, expect, it } from 'vitest';
import { createPage } from '../../core/document/page';
import type { DocElement, DocumentModel } from '../../core/document/types';
import { hitTestElement } from './hit-test';
import { elementsInRect } from './marquee';
import { boundsOf, transformableElements } from './selection-queries';
import { mergeIds, pruneSelection, toggleId } from './selection-ops';

const el = (id: string, x: number, extra: Partial<DocElement> = {}): DocElement => ({
  id,
  name: id,
  x,
  y: 0,
  w: 20,
  h: 20,
  locked: false,
  hidden: false,
  kind: 'shape',
  props: {},
  ...extra,
});

const doc: DocumentModel = {
  page: createPage(210, 297),
  elements: [
    el('a', 0),
    el('b', 10),
    el('c', 100, { locked: true }),
    el('d', 200, { hidden: true }),
  ],
};

describe('selección', () => {
  it('el clic elige el elemento más alto y salta bloqueados u ocultos', () => {
    expect(hitTestElement(doc, { x: 15, y: 5 })?.id).toBe('b');
    expect(hitTestElement(doc, { x: 5, y: 5 })?.id).toBe('a');
    expect(hitTestElement(doc, { x: 110, y: 5 })).toBeNull();
    expect(hitTestElement(doc, { x: 210, y: 5 })).toBeNull();
  });

  it('el rectángulo de selección toca solo elementos seleccionables', () => {
    expect(elementsInRect(doc, { x: 0, y: 0, w: 300, h: 300 })).toEqual(['a', 'b']);
    expect(elementsInRect(doc, { x: 25, y: 5, w: 3, h: 3 })).toEqual(['b']);
  });

  it('opera sobre ids de selección', () => {
    expect(toggleId(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleId(['a', 'b'], 'a')).toEqual(['b']);
    expect(mergeIds(['a'], ['a', 'b'])).toEqual(['a', 'b']);
    const sel = ['a'];
    expect(pruneSelection(doc, sel)).toBe(sel);
    expect(pruneSelection(doc, ['a', 'zz'])).toEqual(['a']);
  });

  it('transformables y límites excluyen bloqueados y ocultos', () => {
    const items = transformableElements(doc, ['a', 'c', 'd', 'b']);
    expect(items.map((e) => e.id)).toEqual(['a', 'b']);
    expect(boundsOf(items)).toEqual({ x: 0, y: 0, w: 30, h: 20 });
    expect(boundsOf([])).toBeNull();
  });
});
