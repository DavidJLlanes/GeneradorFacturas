import { describe, expect, it } from 'vitest';
import { createPage } from '../../core/document/page';
import { DEFAULT_PALETTE, paletteOf } from '../../styles/palette';
import { createEditor } from '../editor/create-editor';
import { setPalette } from './style-commands';

const make = () => createEditor({ page: createPage(210, 297), elements: [] });

describe('setPalette', () => {
  it('cambia la paleta en un solo paso del historial y se puede deshacer', () => {
    const editor = make();
    const next = { ...DEFAULT_PALETTE, primary: '#ff0000' };
    setPalette(editor, next);
    expect(paletteOf(editor.doc()).primary).toBe('#ff0000');
    editor.history.undo();
    expect(paletteOf(editor.doc())).toBe(DEFAULT_PALETTE);
  });

  it('una paleta idéntica no añade pasos al historial', () => {
    const editor = make();
    setPalette(editor, { ...DEFAULT_PALETTE });
    expect(editor.history.canUndo).toBe(false);
  });
});
