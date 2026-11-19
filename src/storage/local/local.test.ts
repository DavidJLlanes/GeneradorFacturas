// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createEditor } from '../../canvas/editor/create-editor';
import { createPage } from '../../core/document/page';
import type { DocumentModel } from '../../core/document/types';
import {
  clearCustomFonts,
  listCustomFonts,
  registerCustomFont,
} from '../../fonts/custom/custom-fonts';
import { attachAutosave } from './autosave';
import { clearEverything } from './clear-all';
import { createMemoryStore } from './memory-store';
import { currentId, type RecordStore } from './record';
import { listTemplates, loadCurrent, openRecord, saveCurrent, saveTemplate } from './records';
import { formatBytes } from './storage-info';
import { thumbnailSvg } from './thumbnail';

const box = (id: string, extra: Record<string, string | number | boolean> = {}) => ({
  id,
  name: id,
  locked: false,
  hidden: false,
  kind: 'shape',
  x: 10,
  y: 10,
  w: 50,
  h: 20,
  props: extra,
});
const doc = (...ids: string[]): DocumentModel => ({
  page: createPage(210, 297),
  elements: ids.map((id) => box(id, { filled: true, fill: '#ff0000' })),
});

let store: RecordStore;
beforeEach(() => {
  store = createMemoryStore();
  clearCustomFonts();
});
afterEach(() => vi.useRealTimers());

describe('registros locales', () => {
  it('guarda y recupera la sesión actual con el diseño y los datos', async () => {
    const editor = createEditor(doc('a'));
    editor.ui.update((s) => ({ ...s, data: { cliente: 'Ana' } }));
    await saveCurrent(store, editor, 'factura');
    const back = await loadCurrent(store, 'factura');
    expect(back?.diseno.documento).toEqual(doc('a'));
    expect(back?.datos).toEqual({ cliente: 'Ana' });
    expect(back?.id).toBe(currentId('factura'));
    expect(await loadCurrent(store, 'otro')).toBeUndefined();
  });

  it('un registro dañado no rompe el arranque', async () => {
    const editor = createEditor(doc('a'));
    await saveCurrent(store, editor, 'factura');
    const rec = await store.get(currentId('factura'));
    await store.put({ ...rec!, version: 99 });
    expect(await loadCurrent(store, 'factura')).toBeUndefined();
  });

  it('guarda plantillas con nombre, las lista por tipo y las abre', async () => {
    const editor = createEditor(doc('a'));
    const saved = await saveTemplate(store, editor, 'factura', '  Mi plantilla ');
    await saveTemplate(store, createEditor(doc('b')), 'albaran', 'De otro tipo');
    expect(saved.nombre).toBe('Mi plantilla');
    expect((await listTemplates(store, 'factura')).map((r) => r.nombre)).toEqual(['Mi plantilla']);
    expect(await listTemplates(store)).toHaveLength(2);

    const other = createEditor(doc('x', 'y'));
    openRecord(other, saved);
    expect(other.doc().elements.map((e) => e.id)).toEqual(['a']);
    other.history.undo();
    expect(other.doc().elements).toHaveLength(2);
  });

  it('la plantilla conserva sus fuentes propias', async () => {
    registerCustomFont({ id: 'custom:q', name: 'Q', mime: 'font/woff2', data: 'AAAA' });
    const d: DocumentModel = {
      page: createPage(210, 297),
      elements: [box('t', { fontFamily: 'custom:q' })],
    };
    const saved = await saveTemplate(store, createEditor(d), 'factura', 'Con fuente');
    clearCustomFonts();
    openRecord(createEditor(doc()), saved);
    expect(listCustomFonts().map((f) => f.id)).toEqual(['custom:q']);
  });

  it('borrar todo vacía el almacén y las fuentes propias', async () => {
    registerCustomFont({ id: 'custom:q', name: 'Q', mime: 'font/woff2', data: 'AAAA' });
    await saveTemplate(store, createEditor(doc('a')), 'factura', 'x');
    await saveCurrent(store, createEditor(doc('a')), 'factura');
    await clearEverything(store);
    expect(await store.list()).toHaveLength(0);
    expect(listCustomFonts()).toHaveLength(0);
  });
});

describe('autoguardado', () => {
  it('guarda tras un cambio de diseño y ignora los cambios de interfaz', async () => {
    vi.useFakeTimers();
    const editor = createEditor(doc('a'));
    const stop = attachAutosave(editor, 'factura', store, 500);

    editor.select(['a']);
    await vi.advanceTimersByTimeAsync(1000);
    expect(await store.list()).toHaveLength(0);

    editor.apply(doc('a', 'b'));
    await vi.advanceTimersByTimeAsync(100);
    expect(await store.list()).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(600);
    const saved = await loadCurrent(store, 'factura');
    expect(saved?.diseno.documento.elements).toHaveLength(2);
    stop();
  });

  it('agrupa varios cambios seguidos y guarda también los datos', async () => {
    vi.useFakeTimers();
    const editor = createEditor(doc('a'));
    const put = vi.spyOn(store, 'put');
    attachAutosave(editor, 'factura', store, 500);
    editor.apply(doc('a', 'b'));
    await vi.advanceTimersByTimeAsync(200);
    editor.ui.update((s) => ({ ...s, data: { n: 1 } }));
    await vi.advanceTimersByTimeAsync(700);
    expect(put).toHaveBeenCalledTimes(1);
    expect((await loadCurrent(store, 'factura'))?.datos).toEqual({ n: 1 });
  });

  it('al parar deja de guardar', async () => {
    vi.useFakeTimers();
    const editor = createEditor(doc('a'));
    const stop = attachAutosave(editor, 'factura', store, 100);
    stop();
    editor.apply(doc('a', 'b'));
    await vi.advanceTimersByTimeAsync(500);
    expect(await store.list()).toHaveLength(0);
  });
});

describe('miniatura y espacio', () => {
  it('dibuja los elementos visibles con sus colores', () => {
    const svg = decodeURIComponent(thumbnailSvg(doc('a')).replace('data:image/svg+xml,', ''));
    expect(svg).toContain('viewBox="0 0 210 297"');
    expect(svg).toContain('fill="#ff0000"');
    const hidden: DocumentModel = {
      ...doc(),
      elements: [{ ...box('h', { filled: true, fill: '#00ff00' }), hidden: true }],
    };
    expect(decodeURIComponent(thumbnailSvg(hidden))).not.toContain('#00ff00');
  });

  it('da formato legible al espacio', () => {
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(2048)).toBe('2 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5,0 MB');
  });
});
