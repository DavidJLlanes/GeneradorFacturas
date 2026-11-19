import { describe, expect, it } from 'vitest';
import { createPage } from '../../core/document/page';
import { pieces } from '../../pieces/discover';
import { createEditor } from '../editor/create-editor';
import { insertPiece, setProps, setRect } from './piece-commands';

const make = () => createEditor({ page: createPage(210, 297), elements: [] });

describe('insertPiece', () => {
  it('centra la pieza en la zona útil, la selecciona y le da nombre numerado', () => {
    const editor = make();
    const text = pieces.get('text')!;
    insertPiece(editor, text);
    insertPiece(editor, text);
    const [first, second] = editor.doc().elements;
    expect(first).toMatchObject({ kind: 'text', name: 'Texto 1', w: 60, h: 10 });
    expect(second?.name).toBe('Texto 2');
    expect(first!.x + first!.w / 2).toBeCloseTo(105);
    expect(editor.ui.get().selection).toEqual([second!.id]);
  });

  it('recorta piezas más grandes que la zona útil', () => {
    const editor = createEditor({ page: createPage(50, 50), elements: [] });
    insertPiece(editor, pieces.get('line')!);
    expect(editor.doc().elements[0]!.w).toBe(30);
  });
});

describe('setProps y setRect', () => {
  it('cambia propiedades de varias piezas en un solo paso y se deshace', () => {
    const editor = make();
    insertPiece(editor, pieces.get('text')!);
    insertPiece(editor, pieces.get('text')!);
    const ids = editor.doc().elements.map((e) => e.id);
    setProps(editor, ids, { bold: true });
    expect(editor.doc().elements.every((e) => e.props['bold'] === true)).toBe(true);
    editor.history.undo();
    expect(editor.doc().elements.some((e) => e.props['bold'] === true)).toBe(false);
  });

  it('no crea paso de historial si no cambia nada', () => {
    const editor = make();
    insertPiece(editor, pieces.get('text')!);
    const before = editor.doc();
    setProps(editor, [before.elements[0]!.id], { text: 'Texto' });
    expect(editor.doc()).toBe(before);
  });

  it('fija posición y tamaño con mínimo de 1 mm', () => {
    const editor = make();
    insertPiece(editor, pieces.get('shape')!);
    const id = editor.doc().elements[0]!.id;
    setRect(editor, id, { x: 12, y: 34, w: 0, h: 20 });
    expect(editor.doc().elements[0]).toMatchObject({ x: 12, y: 34, w: 1, h: 20 });
  });
});
