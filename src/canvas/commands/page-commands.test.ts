import { describe, expect, it } from 'vitest';
import { createPage } from '../../core/document/page';
import type { DocElement, DocumentModel } from '../../core/document/types';
import { pageForPreset, pageWithMargins } from '../../paper/page-builders';
import { presetById } from '../../paper/paper-presets';
import { createEditor } from '../editor/create-editor';
import { buildTargets } from '../snapping/targets';
import { changePage } from './page-commands';

const box: DocElement = {
  id: 'a',
  name: 'a',
  x: 21,
  y: 29.7,
  w: 105,
  h: 148.5,
  locked: false,
  hidden: false,
  kind: 'shape',
  props: {},
};

const make = () => {
  const doc: DocumentModel = { page: createPage(210, 297), elements: [box] };
  const editor = createEditor(doc);
  editor.ui.update((s) => ({ ...s, containerSize: { w: 800, h: 600 } }));
  return editor;
};

describe('changePage', () => {
  it('cambia el papel adaptando las piezas y se puede deshacer', () => {
    const editor = make();
    changePage(editor, pageForPreset(editor.doc().page, presetById('a5')!), 'stretch');
    expect(editor.doc().page).toMatchObject({ widthMm: 148, heightMm: 210 });
    const moved = editor.doc().elements[0]!;
    expect(moved.x).toBeCloseTo((21 * 148) / 210, 1);
    expect(moved.h).toBeCloseTo((148.5 * 210) / 297, 1);

    editor.history.undo();
    expect(editor.doc().page).toMatchObject({ widthMm: 210, heightMm: 297 });
    expect(editor.doc().elements[0]).toBe(box);
  });

  it('con "mantener" las piezas no se mueven', () => {
    const editor = make();
    changePage(editor, pageForPreset(editor.doc().page, presetById('a3')!), 'keep');
    expect(editor.doc().elements[0]).toBe(box);
  });

  it('cambiar solo los márgenes no mueve piezas ni la vista', () => {
    const editor = make();
    const before = editor.ui.get().viewport;
    changePage(
      editor,
      pageWithMargins(editor.doc().page, { top: 5, right: 5, bottom: 5, left: 5 }),
      'stretch',
    );
    expect(editor.doc().page.marginsMm.left).toBe(5);
    expect(editor.doc().elements[0]).toBe(box);
    expect(editor.ui.get().viewport).toBe(before);
  });

  it('no hace nada si la página es idéntica', () => {
    const editor = make();
    changePage(editor, { ...editor.doc().page }, 'stretch');
    expect(editor.history.canUndo).toBe(false);
  });

  it('reencuadra la vista al cambiar de tamaño', () => {
    const editor = make();
    changePage(editor, pageForPreset(editor.doc().page, presetById('ticket-58')!), 'fit');
    expect(editor.ui.get().viewport.zoom).toBeGreaterThan(0);
    expect(editor.history.canUndo).toBe(true);
  });
});

describe('imán a los márgenes', () => {
  it('los márgenes son objetivos de imantado', () => {
    const page = pageWithMargins(createPage(210, 297), { top: 12, right: 8, bottom: 15, left: 20 });
    const t = buildTargets([], page);
    expect(t.x).toEqual(expect.arrayContaining([20, 202]));
    expect(t.y).toEqual(expect.arrayContaining([12, 282]));
  });
});
