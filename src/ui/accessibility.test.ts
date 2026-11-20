// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { createEditor } from '../canvas/editor/create-editor';
import { createPage } from '../core/document/page';
import type { DocElement } from '../core/document/types';
import { mountApp } from './mount-app';

vi.stubGlobal(
  'ResizeObserver',
  class {
    observe(): void {}
    disconnect(): void {}
  },
);

const element = (id: string, name: string): DocElement => ({
  id,
  name,
  locked: false,
  hidden: false,
  kind: 'text',
  x: 10,
  y: 10,
  w: 50,
  h: 10,
  props: {},
});

function mount() {
  const editor = createEditor({
    page: createPage(210, 297),
    elements: [element('a', 'Título'), element('b', 'Pie')],
  });
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  mountApp(root, editor);
  return { editor, root };
}

describe('accesibilidad', () => {
  it('la página tiene zonas, un encabezado principal y un enlace para saltar', () => {
    const { root } = mount();
    expect(root.querySelector('h1')?.textContent).toBeTruthy();
    expect(root.querySelector('header [role="toolbar"][aria-label]')).not.toBeNull();
    expect(root.querySelector('main')).not.toBeNull();
    expect(root.querySelector('a.skip-link')?.getAttribute('href')).toBe('#documento');
    expect(root.querySelector('#documento')?.getAttribute('aria-label')).toBeTruthy();
  });

  it('los botones con texto se nombran por su texto y los de un símbolo, por su descripción', () => {
    const { root } = mount();
    const named = [...root.querySelectorAll<HTMLButtonElement>('.tb-btn')];
    for (const button of named) {
      const text = button.textContent ?? '';
      const label = button.getAttribute('aria-label');
      if (/\p{L}/u.test(text)) expect(label, text).toBeNull();
      else expect(label, text).toBeTruthy();
    }
  });

  it('las capas se eligen con el teclado y se anuncia la selección', async () => {
    const { editor, root } = mount();
    const names = root.querySelectorAll<HTMLButtonElement>('.lp-name');
    expect(names).toHaveLength(2);
    names[0]!.click();
    expect(editor.ui.get().selection).toEqual(['b']);
    const status = (): string | null | undefined =>
      root.querySelector('[role="status"]')?.textContent;
    await vi.waitFor(() => expect(status()).toBe('Seleccionado: Pie'));
    expect(root.querySelector('.lp-name[aria-pressed="true"]')?.textContent).toBe('Pie');
    editor.select([]);
    await vi.waitFor(() => expect(status()).toBe('Nada seleccionado'));
  });
});
