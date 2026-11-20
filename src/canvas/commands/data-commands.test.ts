import { describe, expect, it } from 'vitest';
import { createPage } from '../../core/document/page';
import type { DataSchema } from '../../core/document-type/types';
import { createEditor } from '../editor/create-editor';
import { createRenderContextProvider } from '../render/render-context';
import { setDataSource, setDataValue, toggleFillMode } from './data-commands';

const schema: DataSchema = {
  version: 1,
  fields: [{ key: 'nombre', label: 'Nombre', kind: 'text', group: 'g' }],
};
const make = () => createEditor({ page: createPage(210, 297), elements: [] });

describe('datos del documento', () => {
  it('guarda y borra valores sin tocar el historial de diseño', () => {
    const editor = make();
    setDataValue(editor, 'nombre', 'Ana');
    expect(editor.ui.get().data).toEqual({ nombre: 'Ana' });
    setDataValue(editor, 'nombre', '');
    expect(editor.ui.get().data).toEqual({});
    expect(editor.history.canUndo).toBe(false);
  });

  it('no cambia el estado si el valor es el mismo', () => {
    const editor = make();
    setDataValue(editor, 'a', 'x');
    const data = editor.ui.get().data;
    setDataValue(editor, 'a', 'x');
    expect(editor.ui.get().data).toBe(data);
  });
});

describe('contexto de dibujo', () => {
  it('plantilla limpia deja las variables; con datos las rellena', () => {
    const editor = make();
    setDataSource(editor, { schema });
    setDataValue(editor, 'nombre', 'Ana');
    const provide = createRenderContextProvider();
    expect(provide(editor.ui.get(), 'EUR').resolve('Hola {{nombre}}')).toBe('Hola {{nombre}}');
    toggleFillMode(editor);
    expect(provide(editor.ui.get(), 'EUR').resolve('Hola {{nombre}}')).toBe('Hola Ana');
  });

  it('reutiliza el contexto si no cambian datos, esquema ni modo (zoom, selección…)', () => {
    const editor = make();
    const provide = createRenderContextProvider();
    const first = provide(editor.ui.get(), 'EUR');
    editor.select([]);
    editor.setViewport({ zoom: 2, panX: 0, panY: 0 });
    expect(provide(editor.ui.get(), 'EUR')).toBe(first);
    setDataValue(editor, 'a', '1');
    expect(provide(editor.ui.get(), 'EUR').version).not.toBe(first.version);
  });
});

describe('datos de ejemplo', () => {
  it('se cargan, pasan a la vista rellena y se pueden vaciar', async () => {
    const { loadSampleData, clearData } = await import('./data-commands');
    const editor = make();
    setDataSource(editor, { schema, sample: { nombre: 'Ana' } });
    loadSampleData(editor);
    expect(editor.ui.get()).toMatchObject({ data: { nombre: 'Ana' }, fillMode: true });
    clearData(editor);
    expect(editor.ui.get().data).toEqual({});
    expect(editor.history.canUndo).toBe(false);
  });

  it('sin datos de muestra no hace nada', async () => {
    const { loadSampleData } = await import('./data-commands');
    const editor = make();
    loadSampleData(editor);
    expect(editor.ui.get().fillMode).toBe(false);
  });
});
