// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import type { DataSchema } from '../../core/document-type/types';
import { createPage } from '../../core/document/page';
import type { DocElement } from '../../core/document/types';
import { pieces } from '../../pieces/discover';
import { goToPage, nextPage, previousPage } from '../commands/page-view-commands';
import { setDataSource, setDataValue, toggleFillMode } from '../commands/data-commands';
import { createEditor } from '../editor/create-editor';
import { viewModelOf } from './view-model';

const schema: DataSchema = {
  version: 1,
  fields: [
    {
      key: 'lineas',
      label: 'Líneas',
      kind: 'lines',
      group: 'l',
      columns: [
        { key: 'concepto', label: 'Concepto', kind: 'text', width: 3 },
        { key: 'importe', label: 'Importe', kind: 'money', width: 1 },
      ],
    },
  ],
};

const element = (
  id: string,
  kind: string,
  y: number,
  h: number,
  more?: Partial<DocElement>,
): DocElement => ({
  id,
  name: id,
  locked: false,
  hidden: false,
  kind,
  x: 10,
  y,
  w: 190,
  h,
  props: { ...pieces.get(kind)!.defaultProps },
  ...more,
});

const lines = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ concepto: `Línea ${i}`, importe: 1000 }));

const make = (rows: number) => {
  const editor = createEditor({
    page: createPage(210, 297),
    elements: [
      element('head', 'text', 5, 15, { repeat: true }),
      element('table', 'table', 50, 77),
      element('after', 'text', 140, 20),
    ],
  });
  setDataSource(editor, { schema });
  setDataValue(editor, 'lineas', lines(rows));
  return editor;
};

describe('modelo de vista', () => {
  it('la plantilla limpia es siempre una página con las piezas como se diseñaron', () => {
    const editor = make(80);
    const model = viewModelOf(editor);
    expect(model.pageCount).toBe(1);
    expect(model.items.map((i) => i.rect.y)).toEqual([5, 50, 140]);
    expect(viewModelOf(editor)).toBe(model);
  });

  it('con datos reparte la tabla larga en varias páginas y lo repetido sale en todas', () => {
    const editor = make(80);
    toggleFillMode(editor);
    const first = viewModelOf(editor);
    expect(first.pageCount).toBeGreaterThan(1);
    expect(first.items.some((i) => i.element.id === 'head')).toBe(true);
    nextPage(editor);
    const second = viewModelOf(editor);
    expect(second.pageIndex).toBe(1);
    expect(second.items.some((i) => i.element.id === 'head')).toBe(true);
    expect(second.items.find((i) => i.element.id === 'table')?.slice?.from).toBeGreaterThan(0);
  });

  it('pocas líneas caben en una página y no cambian el diseño', () => {
    const editor = make(3);
    toggleFillMode(editor);
    const model = viewModelOf(editor);
    expect(model.pageCount).toBe(1);
    expect(model.items.find((i) => i.element.id === 'after')?.rect.y).toBe(140);
  });

  it('las líneas que superan el mínimo hacen crecer la tabla y bajan lo de debajo', () => {
    const editor = make(14);
    toggleFillMode(editor);
    const model = viewModelOf(editor);
    const table = model.items.find((i) => i.element.id === 'table')!;
    expect(table.rect.h).toBeGreaterThan(77);
    expect(model.items.find((i) => i.element.id === 'after')!.rect.y).toBeGreaterThan(140);
  });

  it('la navegación se queda dentro de las páginas existentes', () => {
    const editor = make(80);
    toggleFillMode(editor);
    previousPage(editor);
    expect(viewModelOf(editor).pageIndex).toBe(0);
    goToPage(editor, 999);
    const { pageCount, pageIndex } = viewModelOf(editor);
    expect(pageIndex).toBe(pageCount - 1);
    nextPage(editor);
    expect(viewModelOf(editor).pageIndex).toBe(pageCount - 1);
  });

  it('al entrar en la vista con datos se suelta la selección y se vuelve a la primera página', () => {
    const editor = make(80);
    editor.select(['table']);
    toggleFillMode(editor);
    expect(editor.ui.get().selection).toEqual([]);
    nextPage(editor);
    toggleFillMode(editor);
    toggleFillMode(editor);
    expect(editor.ui.get().pageIndex).toBe(0);
  });

  it('recalcula si cambian los datos', () => {
    const editor = make(80);
    toggleFillMode(editor);
    const before = viewModelOf(editor).pageCount;
    setDataValue(editor, 'lineas', lines(3));
    expect(viewModelOf(editor).pageCount).toBeLessThan(before);
  });
});
