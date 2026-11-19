import { describe, expect, it } from 'vitest';
import { findVariables } from '../../data/variables';
import { pieces } from '../../pieces/discover';
import { paletteOf } from '../../styles/palette';
import { paletteKeyOf } from '../../styles/resolve-color';
import definition from './index';

const keys = new Set(definition.schema.fields.map((f) => f.key));
const kindOf = new Map(definition.schema.fields.map((f) => [f.key, f.kind]));

describe.each(definition.templates)('plantilla $name', (template) => {
  const { page, elements } = template.document;

  it('usa solo piezas que existen y con ids únicos', () => {
    for (const el of elements) expect(pieces.get(el.kind), el.id).toBeDefined();
    expect(new Set(elements.map((e) => e.id)).size).toBe(elements.length);
  });

  it('todas las variables existen en el esquema', () => {
    const used = elements.flatMap((el) =>
      ['text', 'rows', 'content'].flatMap((prop) => findVariables(String(el.props[prop] ?? ''))),
    );
    expect(used.length).toBeGreaterThan(10);
    for (const key of used) expect(keys.has(key), key).toBe(true);
  });

  it('los campos enlazados son del tipo adecuado', () => {
    for (const el of elements) {
      if (el.kind === 'table') expect(kindOf.get(String(el.props['field'])), el.id).toBe('lines');
      if (el.kind === 'image' && el.props['field']) {
        expect(kindOf.get(String(el.props['field'])), el.id).toBe('image');
      }
    }
  });

  it('los colores de las piezas son de la paleta (así un tema las recolorea)', () => {
    const colorKeys = new Set(
      pieces.list().flatMap((p) => p.props.filter((s) => s.kind === 'color').map((s) => s.key)),
    );
    for (const el of elements) {
      for (const [key, value] of Object.entries(el.props)) {
        if (colorKeys.has(key)) expect(paletteKeyOf(value), `${el.id}.${key}`).not.toBeNull();
      }
    }
  });

  it('la paleta es completa', () => {
    for (const color of Object.values(paletteOf(template.document))) {
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('todas las piezas caben en el papel', () => {
    for (const el of elements) {
      expect(el.x, el.id).toBeGreaterThanOrEqual(0);
      expect(el.y, el.id).toBeGreaterThanOrEqual(0);
      expect(el.x + el.w, el.id).toBeLessThanOrEqual(page.widthMm);
      expect(el.y + el.h, el.id).toBeLessThanOrEqual(page.heightMm);
    }
  });

  it('el contenido respeta los márgenes (salvo la banda de fondo)', () => {
    const m = page.marginsMm;
    for (const el of elements.filter((e) => e.id !== 'banda')) {
      expect(el.x, el.id).toBeGreaterThanOrEqual(m.left);
      expect(el.x + el.w, el.id).toBeLessThanOrEqual(page.widthMm - m.right);
      expect(el.y + el.h, el.id).toBeLessThanOrEqual(page.heightMm - m.bottom);
    }
  });
});

describe('datos de muestra', () => {
  it('solo usan campos del esquema y las líneas tienen IVA válido', () => {
    const sample = definition.sampleData ?? {};
    for (const key of Object.keys(sample)) expect(keys.has(key), key).toBe(true);
    const options = definition.schema.fields
      .find((f) => f.key === 'lineas')
      ?.columns?.find((c) => c.key === 'iva')
      ?.options?.map((o) => o.value);
    for (const l of sample['lineas'] as { iva: string }[]) expect(options).toContain(l.iva);
  });
});
