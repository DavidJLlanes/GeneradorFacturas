// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import type { DocElement } from '../../core/document/types';
import { createElementsLayer } from './elements-layer';

const context = {
  resolve: (t: string) => t,
  schema: null,
  value: () => undefined,
  fillMode: false,
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
    layer.update([el], context);
    const node = layer.element.querySelector<HTMLElement>('.cv-el')!;
    expect(node.style.display).toBe('flex');
    layer.update([el], context);
    layer.update([{ ...el, x: 5 }], context);
    expect(node.style.display).toBe('flex');
  });

  it('ocultar y mostrar usa el atributo hidden y conserva el dibujo', () => {
    const layer = createElementsLayer();
    const el = text();
    layer.update([el], context);
    const node = layer.element.querySelector<HTMLElement>('.cv-el')!;
    layer.update([{ ...el, hidden: true }], context);
    expect(node.hidden).toBe(true);
    layer.update([{ ...el, hidden: false }], context);
    expect(node.hidden).toBe(false);
    expect(node.style.display).toBe('flex');
  });

  it('solo se redibuja la pieza que cambió', () => {
    const layer = createElementsLayer();
    const a = text();
    const b = text({ id: 'b', props: { text: 'Otra' } });
    layer.update([a, b], context);
    const [nodeA, nodeB] = [...layer.element.querySelectorAll<HTMLElement>('.cv-el')];
    const marker = document.createElement('i');
    nodeA!.append(marker);
    layer.update([a, { ...b, x: 3 }], context);
    expect(nodeA!.contains(marker)).toBe(true);
    expect(nodeB!.textContent).toBe('Otra');
  });
});
