// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import type { DocElement } from '../../core/document/types';
import type { PlacedItem } from '../../layout/types';
import { DEFAULT_PALETTE } from '../../styles/palette';
import { createElementsLayer } from './elements-layer';

// Piezas colocadas como en el modo de diseño; el mismo elemento da siempre la misma pieza colocada.
const placed = new WeakMap<DocElement, PlacedItem>();
const view = (elements: DocElement[]): PlacedItem[] =>
  elements.map((e) => {
    let item = placed.get(e);
    if (!item) {
      item = { element: e, rect: { x: e.x, y: e.y, w: e.w, h: e.h } };
      placed.set(e, item);
    }
    return item;
  });

const context = {
  resolve: (t: string) => t,
  schema: null,
  value: () => undefined,
  fillMode: false,
  currency: 'EUR',
  version: 0,
};
const text = (extra: Partial<DocElement> = {}): DocElement => ({
  id: 'a',
  name: 'a',
  x: 0,
  y: 0,
  w: 40,
  h: 10,
  locked: false,
  hidden: false,
  kind: 'text',
  props: { text: 'Hola' },
  ...extra,
});

describe('capa de elementos', () => {
  it('actualizar sin cambios no pisa el display que fijó la pieza', () => {
    const layer = createElementsLayer();
    const el = text();
    layer.update(view([el]), context, DEFAULT_PALETTE);
    const node = layer.element.querySelector<HTMLElement>('.cv-el')!;
    expect(node.style.display).toBe('flex');
    layer.update(view([el]), context, DEFAULT_PALETTE);
    layer.update(view([{ ...el, x: 5 }]), context, DEFAULT_PALETTE);
    expect(node.style.display).toBe('flex');
  });

  it('ocultar y mostrar usa el atributo hidden y conserva el dibujo', () => {
    const layer = createElementsLayer();
    const el = text();
    layer.update(view([el]), context, DEFAULT_PALETTE);
    const node = layer.element.querySelector<HTMLElement>('.cv-el')!;
    layer.update(view([{ ...el, hidden: true }]), context, DEFAULT_PALETTE);
    expect(node.hidden).toBe(true);
    layer.update(view([{ ...el, hidden: false }]), context, DEFAULT_PALETTE);
    expect(node.hidden).toBe(false);
    expect(node.style.display).toBe('flex');
  });

  it('solo se redibuja la pieza que cambió', () => {
    const layer = createElementsLayer();
    const a = text();
    const b = text({ id: 'b', props: { text: 'Otra' } });
    layer.update(view([a, b]), context, DEFAULT_PALETTE);
    const [nodeA, nodeB] = [...layer.element.querySelectorAll<HTMLElement>('.cv-el')];
    const marker = document.createElement('i');
    nodeA!.append(marker);
    layer.update(view([a, { ...b, x: 3 }]), context, DEFAULT_PALETTE);
    expect(nodeA!.contains(marker)).toBe(true);
    expect(nodeB!.textContent).toBe('Otra');
  });

  it('los colores enlazados a la paleta se resuelven y se redibujan al cambiarla', () => {
    const layer = createElementsLayer();
    const el = text({ props: { text: 'Hola', color: '@primary' } });
    layer.update(view([el]), context, DEFAULT_PALETTE);
    const node = layer.element.querySelector<HTMLElement>('.cv-el')!;
    expect(node.style.color).toBe('#1f2937');
    layer.update(view([el]), context, { ...DEFAULT_PALETTE, primary: '#ff0000' });
    expect(node.style.color).toBe('#ff0000');
  });

  it('un color propio no cambia con la paleta', () => {
    const layer = createElementsLayer();
    const el = text({ props: { text: 'Hola', color: '#00ff00' } });
    layer.update(view([el]), context, DEFAULT_PALETTE);
    layer.update(view([el]), context, { ...DEFAULT_PALETTE, primary: '#ff0000' });
    expect(layer.element.querySelector<HTMLElement>('.cv-el')!.style.color).toBe('#00ff00');
  });
});
