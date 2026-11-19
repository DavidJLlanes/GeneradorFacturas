import { describe, expect, it } from 'vitest';
import { createPage } from '../core/document/page';
import type { DocElement, DocumentModel } from '../core/document/types';
import { layoutDocument } from './layout-document';
import type { Layout, Measure, PlacedItem } from './types';

const el = (id: string, x: number, y: number, w: number, h: number, more?: Partial<DocElement>) =>
  ({
    id,
    name: id,
    locked: false,
    hidden: false,
    kind: 'x',
    props: {},
    x,
    y,
    w,
    h,
    ...more,
  }) as DocElement;

const doc = (...elements: DocElement[]): DocumentModel => ({
  page: createPage(210, 297),
  elements,
});

// Tabla de prueba: cabecera de 7 mm y `rows` filas de 7 mm.
const rowsOf = (rows: number): Measure => ({ headMm: 7, unitsMm: Array(rows).fill(7) });
const measureOf = (rows: number) => (e: DocElement) => (e.id === 'table' ? rowsOf(rows) : null);

const find = (layout: Layout, page: number, id: string): PlacedItem[] =>
  layout.pages[page]!.items.filter((i) => i.element.id === id);
const one = (layout: Layout, page: number, id: string): PlacedItem => find(layout, page, id)[0]!;

// Márgenes por defecto de createPage(210, 297): se consulta para no depender de su valor.
const page = createPage(210, 297);
const bottom = page.heightMm - page.marginsMm.bottom;

describe('reparto en páginas', () => {
  it('sin crecimiento es una sola página idéntica al diseño', () => {
    const d = doc(el('a', 10, 10, 50, 10), el('table', 10, 50, 190, 77), el('b', 10, 140, 50, 10));
    const layout = layoutDocument(d, measureOf(10));
    expect(layout.pages).toHaveLength(1);
    for (const item of layout.pages[0]!.items) {
      const { x, y, w, h } = item.element;
      expect(item.rect).toEqual({ x, y, w, h });
      expect(item.slice).toBeUndefined();
    }
  });

  it('la tabla que crece empuja lo de debajo y no lo de arriba ni lo de al lado', () => {
    const d = doc(
      el('above', 10, 10, 50, 10),
      el('table', 10, 50, 120, 77),
      el('beside', 140, 60, 50, 10),
      el('below', 10, 140, 50, 10),
    );
    const layout = layoutDocument(d, measureOf(14)); // 7 + 14×7 = 105 → crece 28
    expect(layout.pages).toHaveLength(1);
    expect(one(layout, 0, 'above').rect.y).toBe(10);
    expect(one(layout, 0, 'table').rect.h).toBe(105);
    expect(one(layout, 0, 'beside').rect.y).toBe(60);
    expect(one(layout, 0, 'below').rect.y).toBe(168);
  });

  it('una tabla con menos filas que el mínimo no encoge', () => {
    const d = doc(el('table', 10, 50, 190, 77), el('below', 10, 140, 50, 10));
    const layout = layoutDocument(d, measureOf(3));
    expect(one(layout, 0, 'table').rect.h).toBe(77);
    expect(one(layout, 0, 'below').rect.y).toBe(140);
  });

  it('una tabla larga se parte por filas, repite la cabecera y no se sale de la zona útil', () => {
    const d = doc(el('table', 10, 50, 190, 77));
    const layout = layoutDocument(d, measureOf(80));
    expect(layout.pages.length).toBeGreaterThan(2);
    let next = 0;
    layout.pages.forEach((_, p) => {
      const item = one(layout, p, 'table');
      expect(item.slice!.from).toBe(next);
      next = item.slice!.to;
      expect(item.slice!.to).toBeGreaterThan(item.slice!.from);
      const rows = item.slice!.to - item.slice!.from;
      expect(item.rect.h).toBe(7 + rows * 7);
      expect(item.rect.y + item.rect.h).toBeLessThanOrEqual(bottom + 0.001);
      if (p > 0) expect(item.rect.y).toBe(page.marginsMm.top);
    });
    expect(next).toBe(80);
  });

  it('lo que va debajo de la tabla queda tras su último trozo, en la última página', () => {
    const d = doc(el('table', 10, 50, 190, 77), el('totals', 120, 140, 80, 30));
    const layout = layoutDocument(d, measureOf(80));
    const last = layout.pages.length - 1;
    expect(find(layout, 0, 'totals')).toHaveLength(0);
    const table = one(layout, last, 'table');
    const totals = one(layout, last, 'totals');
    expect(totals.rect.y).toBeGreaterThanOrEqual(table.rect.y + table.rect.h - 0.001);
    expect(totals.rect.y + totals.rect.h).toBeLessThanOrEqual(bottom + 0.001);
  });

  it('una pieza que no cabe en lo que queda de página salta a la siguiente', () => {
    const d = doc(el('table', 10, 50, 190, 77), el('totals', 10, 140, 190, 60));
    // Tabla de 32 filas: acaba cerca del final de la página y los totales (60 mm) no caben.
    const layout = layoutDocument(d, measureOf(30));
    expect(layout.pages).toHaveLength(2);
    expect(find(layout, 0, 'totals')).toHaveLength(0);
    expect(one(layout, 1, 'totals').rect.y).toBe(page.marginsMm.top);
  });

  it('las piezas repetidas salen en todas las páginas, en su sitio, y acotan la zona útil', () => {
    const d = doc(
      el('head', 0, 0, 210, 20, { repeat: true }),
      el('foot', 0, 277, 210, 20, { repeat: true }),
      el('table', 10, 50, 190, 77),
    );
    const layout = layoutDocument(d, measureOf(80));
    layout.pages.forEach((_, p) => {
      expect(one(layout, p, 'head').rect.y).toBe(0);
      expect(one(layout, p, 'foot').rect.y).toBe(277);
      const table = one(layout, p, 'table');
      expect(table.rect.y + table.rect.h).toBeLessThanOrEqual(277 + 0.001);
      if (p > 0) expect(table.rect.y).toBe(20);
    });
  });

  it('lo diseñado fuera de la zona útil y que nunca se ha movido se queda donde está', () => {
    const d = doc(el('note', 10, 285, 100, 8), el('table', 10, 50, 190, 77));
    const layout = layoutDocument(d, measureOf(5));
    expect(layout.pages).toHaveLength(1);
    expect(one(layout, 0, 'note').rect.y).toBe(285);
  });

  it('ignora las piezas ocultas', () => {
    const d = doc(el('a', 10, 10, 50, 10, { hidden: true }), el('b', 10, 30, 50, 10));
    const layout = layoutDocument(d, () => null);
    expect(find(layout, 0, 'a')).toHaveLength(0);
    expect(find(layout, 0, 'b')).toHaveLength(1);
  });

  it('conserva el orden de apilado original', () => {
    const d = doc(
      el('a', 0, 0, 10, 10),
      el('head', 0, 0, 10, 10, { repeat: true }),
      el('c', 0, 20, 10, 10),
    );
    const ids = layoutDocument(d, () => null).pages[0]!.items.map((i) => i.element.id);
    expect(ids).toEqual(['a', 'head', 'c']);
  });

  it('un documento vacío tiene una página', () => {
    expect(layoutDocument(doc(), () => null).pages).toHaveLength(1);
  });

  it('para cualquier número de filas: trozos contiguos, dentro de la zona útil y totales sin solaparse', () => {
    const d = doc(el('table', 10, 50, 190, 77), el('totals', 120, 140, 80, 30));
    for (let rows = 0; rows <= 160; rows += 1) {
      const layout = layoutDocument(d, measureOf(rows));
      let next = 0;
      layout.pages.forEach((pageLayout, p) => {
        for (const item of pageLayout.items) {
          expect(item.rect.y + item.rect.h, `${rows} filas, pág. ${p + 1}`).toBeLessThanOrEqual(
            bottom + 0.001,
          );
        }
        for (const item of find(layout, p, 'table')) {
          expect(item.slice?.from ?? 0).toBe(next);
          next = item.slice?.to ?? rows;
        }
      });
      expect(next, `${rows} filas`).toBe(rows);
      const last = layout.pages.length - 1;
      const table = find(layout, last, 'table')[0];
      const totals = one(layout, last, 'totals');
      // Si los totales no caben tras la tabla, van al principio de una página nueva.
      if (table) expect(totals.rect.y).toBeGreaterThanOrEqual(table.rect.y + table.rect.h - 0.001);
      else expect(totals.rect.y).toBe(page.marginsMm.top);
    }
  });
});
