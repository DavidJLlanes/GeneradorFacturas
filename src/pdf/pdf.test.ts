// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import type { DataSchema } from '../core/document-type/types';
import { createPage } from '../core/document/page';
import type { DocElement } from '../core/document/types';
import { setDataSource, setDataValue } from '../canvas/commands/data-commands';
import { createEditor } from '../canvas/editor/create-editor';
import { pieces } from '../pieces/discover';
import { buildPrintRoot, planPrint } from './build-print-root';
import { attachPrint, pageCountFor } from './print-document';

const schema: DataSchema = {
  version: 1,
  fields: [
    { key: 'nombre', label: 'Nombre', kind: 'text', group: 'g' },
    {
      key: 'lineas',
      label: 'Líneas',
      kind: 'lines',
      group: 'g',
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
  props: object = {},
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
  props: { ...pieces.get(kind)!.defaultProps, ...props },
});

const lines = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ concepto: `L${i}`, importe: 100 }));

const make = (rows: number, page = createPage(210, 297)) => {
  const editor = createEditor({
    page,
    elements: [
      element('hola', 'text', 10, 10, {
        text: 'Hola {{nombre}} {{falta}} p.{{pagina}}/{{paginas}}',
      }),
      element('table', 'table', 50, 77),
      element('oculto', 'text', 140, 10, { text: 'no sale' }),
    ].map((e) =>
      e.id === 'oculto' ? { ...e, hidden: true } : e.id === 'hola' ? { ...e, repeat: true } : e,
    ),
  });
  setDataSource(editor, { schema });
  setDataValue(editor, 'nombre', 'Ana');
  setDataValue(editor, 'lineas', lines(rows));
  return editor;
};

afterEach(() => {
  document.body.replaceChildren();
});

describe('plan de impresión', () => {
  it('relleno: reparte en páginas con los datos; limpio: una página sin datos', () => {
    const editor = make(80);
    expect(pageCountFor(editor, 'filled')).toBeGreaterThan(1);
    expect(pageCountFor(editor, 'clean')).toBe(1);
  });

  it('las piezas ocultas no se imprimen', () => {
    const editor = make(3);
    for (const mode of ['filled', 'clean'] as const) {
      const ids = planPrint(editor.doc(), editor.ui.get(), mode).pages.flatMap((p) =>
        p.items.map((i) => i.element.id),
      );
      expect(ids, mode).not.toContain('oculto');
    }
  });
});

describe('documento imprimible', () => {
  it('una página por hoja con el tamaño del papel y @page ajustado', () => {
    const editor = make(80);
    const doc = editor.doc();
    const root = buildPrintRoot(doc, planPrint(doc, editor.ui.get(), 'filled'));
    const pages = root.querySelectorAll('.pdf-page');
    expect(pages.length).toBeGreaterThan(1);
    expect(root.querySelector('style')?.textContent).toContain('size: 210mm 297mm');
    expect(root.querySelector('style')?.textContent).toContain('margin: 0');
  });

  it('el tamaño de @page sigue al papel (apaisado y personalizado)', () => {
    const editor = make(3, createPage(297, 210));
    const doc = editor.doc();
    const root = buildPrintRoot(doc, planPrint(doc, editor.ui.get(), 'clean'));
    expect(root.querySelector('style')?.textContent).toContain('size: 297mm 210mm');
  });

  it('rellena los datos y el número de página, y quita las variables que faltan', () => {
    const editor = make(80);
    const doc = editor.doc();
    const plan = planPrint(doc, editor.ui.get(), 'filled');
    const root = buildPrintRoot(doc, plan);
    const text = [...root.querySelectorAll('.pdf-page')].map((p) => p.textContent ?? '');
    const total = plan.pages.length;
    expect(text[0]).toContain(`Hola Ana  p.1/${total}`);
    expect(text[1]).toContain(`p.2/${total}`);
    for (const t of text) expect(t).not.toContain('{{');
  });

  it('el modelo limpio no lleva datos ni variables sin resolver', () => {
    const editor = make(80);
    const doc = editor.doc();
    const root = buildPrintRoot(doc, planPrint(doc, editor.ui.get(), 'clean'));
    const text = root.textContent ?? '';
    expect(text).not.toContain('Ana');
    expect(text).not.toContain('{{');
    expect(text).not.toContain('L5');
  });

  it('la tabla partida dibuja cada trozo con su cabecera', () => {
    const editor = make(80);
    const doc = editor.doc();
    const root = buildPrintRoot(doc, planPrint(doc, editor.ui.get(), 'filled'));
    for (const page of root.querySelectorAll('.pdf-page')) {
      const table = page.querySelector<HTMLElement>('[data-id="table"]');
      expect(table?.firstElementChild?.textContent).toBe('Concepto');
    }
  });
});

describe('impresión', () => {
  it('prepara el documento antes de imprimir y lo retira después', () => {
    const editor = make(3);
    const off = attachPrint(editor);
    window.dispatchEvent(new Event('beforeprint'));
    expect(document.querySelectorAll('.pdf-root')).toHaveLength(1);
    window.dispatchEvent(new Event('beforeprint'));
    expect(document.querySelectorAll('.pdf-root')).toHaveLength(1);
    window.dispatchEvent(new Event('afterprint'));
    expect(document.querySelectorAll('.pdf-root')).toHaveLength(0);
    off();
  });
});
