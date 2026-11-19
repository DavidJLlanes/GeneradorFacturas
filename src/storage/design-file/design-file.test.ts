// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { createEditor } from '../../canvas/editor/create-editor';
import { createPage } from '../../core/document/page';
import type { DocumentModel } from '../../core/document/types';
import {
  clearCustomFonts,
  listCustomFonts,
  registerCustomFont,
} from '../../fonts/custom/custom-fonts';
import { DEFAULT_PALETTE } from '../../styles/palette';
import { applyData } from '../data-file/apply-data';
import { buildDataFile, dataToJson, parseDataFile } from '../data-file/data-file';
import { fileSlug } from '../files/file-name';
import { applyDesign } from './apply-design';
import { buildDesign, designToJson } from './build-design';
import { DESIGN_VERSION } from './format';
import { migrateTo } from './migrate';
import { parseDesign } from './parse-design';

const font = { id: 'custom:abc', name: 'Marca', mime: 'font/woff2', data: 'AAAA' };
const doc: DocumentModel = {
  page: createPage(210, 297),
  palette: { ...DEFAULT_PALETTE, primary: '#ff0000' },
  elements: [
    {
      id: 'e1',
      name: 'Título',
      locked: false,
      hidden: false,
      repeat: true,
      kind: 'text',
      x: 10,
      y: 10,
      w: 80,
      h: 12,
      props: { text: 'Hola', fontFamily: font.id, bold: true, fontSize: 14 },
    },
  ],
};

beforeEach(() => clearCustomFonts());

describe('archivo de diseño', () => {
  it('guarda y recupera el diseño con su tipo y las fuentes propias que usa', () => {
    registerCustomFont(font);
    registerCustomFont({ ...font, id: 'custom:sobra' });
    const file = buildDesign(doc, 'factura', 'Mi factura');
    expect(file.fuentes.map((f) => f.id)).toEqual(['custom:abc']);

    const back = parseDesign(designToJson(file));
    expect(back.tipoDocumento).toBe('factura');
    expect(back.nombre).toBe('Mi factura');
    expect(back.documento).toEqual(doc);
    expect(back.fuentes).toEqual([font]);
  });

  it('no incluye datos del documento', () => {
    const json = designToJson(buildDesign(doc, 'factura', 'x'));
    expect(json).not.toContain('"datos"');
  });

  it('abrirlo en el editor es un paso deshacible, registra las fuentes y deja los datos', () => {
    const editor = createEditor({ page: createPage(148, 210), elements: [] });
    editor.ui.update((s) => ({ ...s, data: { a: 1 } }));
    applyDesign(
      editor,
      parseDesign(designToJson({ ...buildDesign(doc, 'f', 'n'), fuentes: [font] })),
    );
    expect(editor.doc()).toEqual(doc);
    expect(listCustomFonts()).toHaveLength(1);
    expect(editor.ui.get().data).toEqual({ a: 1 });
    editor.history.undo();
    expect(editor.doc().page.widthMm).toBe(148);
  });

  it('rechaza lo que no es un diseño, con mensajes claros', () => {
    expect(() => parseDesign('no es json')).toThrow(/no es un diseño válido/);
    expect(() => parseDesign('{"hola":1}')).toThrow(/no es un diseño de Generador/);
    const base = JSON.parse(designToJson(buildDesign(doc, 'f', 'n'))) as Record<string, unknown>;
    expect(() => parseDesign(JSON.stringify({ ...base, documento: { page: {} } }))).toThrow(
      /dañado/,
    );
    expect(() => parseDesign(JSON.stringify({ ...base, tipoDocumento: '' }))).toThrow(
      /tipo de documento/,
    );
    expect(() => parseDesign(JSON.stringify({ ...base, version: DESIGN_VERSION + 1 }))).toThrow(
      /más nueva/,
    );
  });

  it('descarta propiedades que no son valores simples', () => {
    const base = JSON.parse(designToJson(buildDesign(doc, 'f', 'n'))) as {
      documento: { elements: { props: Record<string, unknown> }[] };
    };
    base.documento.elements[0]!.props['raro'] = { a: 1 };
    const back = parseDesign(JSON.stringify(base));
    expect(back.documento.elements[0]?.props).not.toHaveProperty('raro');
  });
});

describe('migración entre versiones', () => {
  it('aplica las migraciones en orden hasta la versión actual', () => {
    const migrations = {
      1: (r: Record<string, unknown>) => ({ ...r, a: 'uno' }),
      2: (r: Record<string, unknown>) => ({ ...r, b: `${String(r['a'])}-dos` }),
    };
    const out = migrateTo({ version: 1 }, 3, migrations);
    expect(out).toMatchObject({ version: 3, a: 'uno', b: 'uno-dos' });
  });

  it('falla si falta un paso o la versión no es válida', () => {
    expect(() => migrateTo({ version: 1 }, 2, {})).toThrow(/versión 1/);
    expect(() => migrateTo({}, 1)).toThrow(/versión/);
  });
});

describe('archivo de datos', () => {
  it('va aparte del diseño y se vuelve a cargar', () => {
    const file = parseDataFile(dataToJson(buildDataFile({ cliente: 'Ana' }, 'factura')));
    expect(file.tipoDocumento).toBe('factura');
    const editor = createEditor(doc);
    applyData(editor, file);
    expect(editor.ui.get().data).toEqual({ cliente: 'Ana' });
    expect(editor.ui.get().fillMode).toBe(true);
    expect(editor.doc()).toBe(doc);
  });

  it('rechaza archivos que no son de datos', () => {
    expect(() => parseDataFile('{"formato":"otro"}')).toThrow(/no es un archivo de datos/);
    expect(() => parseDataFile('x')).toThrow(/no son datos válidos/);
  });
});

describe('nombre de archivo', () => {
  it('quita acentos y símbolos', () => {
    expect(fileSlug('Factura Nº 1 — León')).toBe('factura-n-1-leon');
    expect(fileSlug('???')).toBe('documento');
  });
});
