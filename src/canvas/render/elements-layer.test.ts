// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import type { DocElement } from '../../core/document/types';
import { DEFAULT_PALETTE } from '../../styles/palette';
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
    layer.update([el], context, DEFAULT_PALETTE);
    const node = layer.element.querySelector<HTMLElement>('.cv-el')!;
    expect(node.style.display).toBe('flex');
    layer.update([el], context, DEFAULT_PALETTE);
    layer.update([{ ...el, x: 5 }], context, DEFAULT_PALETTE);
    expect(node.style.display).toBe('flex');
  });

  it('ocultar y mostrar usa el atributo hidden y conserva el dibujo', () => {
    const layer = createElementsLayer();
    const el = text();
    layer.update([el], context, DEFAULT_PALETTE);
    const node = layer.element.querySelector<HTMLElement>('.cv-el')!;
    layer.update([{ ...el, hidden: true }], context, DEFAULT_PALETTE);
    expect(node.hidden).toBe(true);
    layer.update([{ ...el, hidden: false }], context, DEFAULT_PALETTE);
    expect(node.hidden).toBe(false);
    expect(node.style.display).toBe('flex');
  });

  it('solo se redibuja la pieza que cambió', () => {
    const layer = createElementsLayer();
    const a = text();
    const b = text({ id: 'b', props: { text: 'Otra' } });
    layer.update([a, b], context, DEFAULT_PALETTE);
    const [nodeA, nodeB] = [...layer.element.querySelectorAll<HTMLElement>('.cv-el')];
    const marker = document.createElement('i');
    nodeA!.append(marker);
    layer.update([a, { ...b, x: 3 }], context, DEFAULT_PALETTE);
    expect(nodeA!.contains(marker)).toBe(true);
    expect(nodeB!.textContent).toBe('Otra');
  });

  it('los colores enlazados a la paleta se resuelven y se redibujan al cambiarla', () => {
    const layer = createElementsLayer();
    const el = text({ props: { text: 'Hola', color: '@primary' } });
    layer.update([el], context, DEFAULT_PALETTE);
    const node = layer.element.querySelector<HTMLElement>('.cv-el')!;
    expect(node.style.color).toBe('#1f2937');
    layer.update([el], context, { ...DEFAULT_PALETTE, primary: '#ff0000' });
    expect(node.style.color).toBe('#ff0000');
  });

  it('un color propio no cambia con la paleta', () => {
    const layer = createElementsLayer();
    const el = text({ props: { text: 'Hola', color: '#00ff00' } });
    layer.update([el], context, DEFAULT_PALETTE);
    layer.update([el], context, { ...DEFAULT_PALETTE, primary: '#ff0000' });
    expect(layer.element.querySelector<HTMLElement>('.cv-el')!.style.color).toBe('#00ff00');
  });
});
