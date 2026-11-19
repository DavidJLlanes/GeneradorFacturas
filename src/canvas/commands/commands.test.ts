import { describe, expect, it } from 'vitest';
import { createPage } from '../../core/document/page';
import type { DocElement, DocumentModel } from '../../core/document/types';
import { pieces } from '../../pieces/discover';
import { createEditor } from '../editor/create-editor';
import { alignSelection, distributeSelection } from './align-commands';
import { deleteSelection, duplicateSelection, nudgeSelection, selectAll } from './element-commands';
import { toggleHideSelection, toggleLockSelection } from './flag-commands';
import { redo, undo } from './history-commands';
import { bringToFront } from './order-commands';
import { insertPiece } from './piece-commands';
import { zoomToFit, zoomToSelection } from './view-commands';

const el = (id: string, x: number, y = 0, extra: Partial<DocElement> = {}): DocElement => ({
  id,
  name: id,
  x,
  y,
  w: 10,
  h: 10,
  locked: false,
  hidden: false,
  kind: 'shape',
  props: {},
  ...extra,
});

const make = (...elements: DocElement[]) => {
  const doc: DocumentModel = { page: createPage(210, 297), elements };
  return createEditor(doc);
};

describe('comandos del editor', () => {
  it('añade, deshace y rehace', () => {
    const editor = make();
    insertPiece(editor, pieces.get('text')!);
    expect(editor.doc().elements).toHaveLength(1);
    expect(editor.ui.get().selection).toHaveLength(1);
    undo(editor);
    expect(editor.doc().elements).toHaveLength(0);
    expect(editor.ui.get().selection).toEqual([]); // la selección se limpia sola
    redo(editor);
    expect(editor.doc().elements).toHaveLength(1);
  });

  it('elimina lo seleccionado salvo lo bloqueado', () => {
    const editor = make(el('a', 0), el('b', 20, 0, { locked: true }));
    editor.select(['a', 'b']);
    deleteSelection(editor);
    expect(editor.doc().elements.map((e) => e.id)).toEqual(['b']);
  });

  it('duplica y selecciona las copias', () => {
    const editor = make(el('a', 0));
    editor.select(['a']);
    duplicateSelection(editor);
    expect(editor.doc().elements).toHaveLength(2);
    expect(editor.ui.get().selection).toEqual([editor.doc().elements[1]!.id]);
  });

  it('selecciona todo lo seleccionable', () => {
    const editor = make(
      el('a', 0),
      el('b', 20, 0, { locked: true }),
      el('c', 40, 0, { hidden: true }),
    );
    selectAll(editor);
    expect(editor.ui.get().selection).toEqual(['a']);
  });

  it('mueve con flechas solo lo que no está bloqueado', () => {
    const editor = make(el('a', 0), el('b', 20, 0, { locked: true }));
    editor.select(['a', 'b']);
    nudgeSelection(editor, 1, 2);
    expect(editor.doc().elements[0]).toMatchObject({ x: 1, y: 2 });
    expect(editor.doc().elements[1]).toMatchObject({ x: 20, y: 0 });
  });

  it('bloquea y oculta alternando', () => {
    const editor = make(el('a', 0));
    editor.select(['a']);
    toggleLockSelection(editor);
    expect(editor.doc().elements[0]!.locked).toBe(true);
    toggleLockSelection(editor);
    expect(editor.doc().elements[0]!.locked).toBe(false);
    toggleHideSelection(editor);
    expect(editor.doc().elements[0]!.hidden).toBe(true);
    expect(editor.ui.get().selection).toEqual([]);
  });

  it('cambia el orden de apilado', () => {
    const editor = make(el('a', 0), el('b', 20));
    editor.select(['a']);
    bringToFront(editor);
    expect(editor.doc().elements.map((e) => e.id)).toEqual(['b', 'a']);
  });

  it('alinea con la página si hay uno y entre sí si hay varios', () => {
    const one = make(el('a', 50, 50));
    one.select(['a']);
    alignSelection(one, 'left');
    expect(one.doc().elements[0]!.x).toBe(0);

    const many = make(el('a', 50), el('b', 80));
    many.select(['a', 'b']);
    alignSelection(many, 'left');
    expect(many.doc().elements.map((e) => e.x)).toEqual([50, 50]);
  });

  it('distribuye tres elementos', () => {
    const editor = make(el('a', 0), el('b', 15), el('c', 90));
    editor.select(['a', 'b', 'c']);
    distributeSelection(editor, 'horizontal');
    expect(editor.doc().elements.map((e) => e.x)).toEqual([0, 45, 90]);
  });

  it('el zoom encuadra página y selección', () => {
    const editor = make(el('a', 100, 100));
    editor.ui.update((s) => ({ ...s, containerSize: { w: 800, h: 600 } }));
    zoomToFit(editor);
    const fit = editor.ui.get().viewport.zoom;
    editor.select(['a']);
    zoomToSelection(editor);
    expect(editor.ui.get().viewport.zoom).toBeGreaterThan(fit);
  });

  it('agrupa varios cambios en un único aviso', async () => {
    const editor = make(el('a', 0));
    let calls = 0;
    editor.onChange(() => calls++);
    editor.select(['a']);
    editor.select([]);
    editor.setViewport({ zoom: 2, panX: 0, panY: 0 });
    await Promise.resolve();
    expect(calls).toBe(1);
  });
});
