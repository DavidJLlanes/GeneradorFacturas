import { describe, expect, it } from 'vitest';
import type { DocumentData } from '../../core/document-type/types';
import { createMeasure } from '../../layout/measure-element';
import { layoutDocument } from '../../layout/layout-document';
import definition from './index';
import { sampleData } from './sample';

const withLines = (n: number): DocumentData => ({
  ...sampleData,
  lineas: Array.from({ length: n }, (_, i) => ({
    concepto: `Servicio ${i + 1}`,
    cantidad: 1,
    precio: 1000,
    iva: '21',
  })),
});

const layoutOf = (templateIndex: number, data: DocumentData) => {
  const derived = { ...data, ...definition.compute?.(data) };
  const doc = definition.templates[templateIndex]!.document;
  return layoutDocument(
    doc,
    createMeasure({ schema: definition.schema, value: (k) => derived[k], fillMode: true }),
  );
};

describe.each(definition.templates.map((t, i) => [t.name, i] as const))(
  'paginación: %s',
  (_, index) => {
    it('con pocas líneas es una página igual al diseño', () => {
      const layout = layoutOf(index, withLines(3));
      expect(layout.pages).toHaveLength(1);
      for (const item of layout.pages[0]!.items) {
        expect(item.rect.y, item.element.id).toBe(item.element.y);
      }
    });

    it('con muchas líneas se reparte: el pie en todas y los totales en la última', () => {
      const layout = layoutOf(index, withLines(70));
      expect(layout.pages.length).toBeGreaterThan(1);
      const idsOf = (p: number) => layout.pages[p]!.items.map((i) => i.element.id);
      layout.pages.forEach((_, p) => expect(idsOf(p), `pág. ${p + 1}`).toContain('pie'));
      const last = layout.pages.length - 1;
      expect(idsOf(last)).toContain('totales');
      expect(idsOf(0)).not.toContain('totales');
      expect(idsOf(0)).toContain('cliente-nombre');
      expect(idsOf(last)).not.toContain('cliente-nombre');
    });

    it('ninguna página tiene piezas que invadan el pie', () => {
      const layout = layoutOf(index, withLines(70));
      for (const page of layout.pages) {
        for (const item of page.items) {
          if (item.element.id === 'pie') continue;
          const flows = item.element.repeat !== true;
          if (flows)
            expect(item.rect.y + item.rect.h, item.element.id).toBeLessThanOrEqual(277.001);
        }
      }
    });

    it('todas las líneas se dibujan, ni una menos ni repetida', () => {
      const layout = layoutOf(index, withLines(70));
      let next = 0;
      for (const page of layout.pages) {
        for (const item of page.items) {
          if (item.element.id !== 'tabla') continue;
          expect(item.slice!.from).toBe(next);
          next = item.slice!.to;
        }
      }
      expect(next).toBeGreaterThanOrEqual(70);
    });
  },
);
