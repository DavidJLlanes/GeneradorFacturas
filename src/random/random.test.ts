import { describe, expect, it } from 'vitest';
import { documentTypes } from '../core/document-type/discover';
import { fontById } from '../fonts/catalog';
import { THEMES } from '../styles/themes';
import { generateData } from './fake-data';
import { fakeNif } from './fake-values';
import { randomDesign } from './random-design';
import { createRng } from './rng';

const TODAY = new Date(2026, 10, 19);

describe('generador con semilla', () => {
  it('la misma semilla da la misma secuencia', () => {
    const a = createRng(7);
    const b = createRng(7);
    expect([a.next(), a.next(), a.int(1, 9)]).toEqual([b.next(), b.next(), b.int(1, 9)]);
    expect(createRng(8).next()).not.toBe(createRng(7).next());
  });

  it('int, pick y chance respetan sus límites', () => {
    const rng = createRng(1);
    for (let i = 0; i < 200; i += 1) {
      const n = rng.int(3, 5);
      expect(n >= 3 && n <= 5).toBe(true);
    }
    expect(['a', 'b']).toContain(rng.pick(['a', 'b']));
    expect(() => rng.pick([])).toThrow();
    expect(rng.chance(0)).toBe(false);
    expect(rng.chance(1)).toBe(true);
  });

  it('el NIF de persona tiene la letra de control correcta', () => {
    const nif = fakeNif(createRng(3), false);
    const n = Number(nif.slice(0, 8));
    expect(nif[8]).toBe('TRWAGMYFPDXBNJZSQVHLCKE'[n % 23]);
    expect(fakeNif(createRng(3), true)).toMatch(/^B\d{7}0$/);
  });
});

describe('datos ficticios para cualquier tipo', () => {
  for (const type of documentTypes.list()) {
    it(`${type.id}: rellena los campos obligatorios y respeta el esquema`, () => {
      const data = generateData(type.schema, createRng(42), TODAY);
      const keys = new Set(type.schema.fields.map((f) => f.key));
      for (const key of Object.keys(data)) expect(keys.has(key), key).toBe(true);
      for (const f of type.schema.fields) {
        if (f.computed || f.kind === 'image') expect(data).not.toHaveProperty(f.key);
        else if (f.required) expect(data[f.key], f.key).toBeTruthy();
      }
    });
  }

  it('las fechas son recientes y las líneas no están vacías', () => {
    const data = generateData(documentTypes.get('presupuesto')!.schema, createRng(5), TODAY);
    expect(String(data['fecha'])).toMatch(/^2026-(09|10|11)-\d{2}$/);
    const lines = data['lineas'] as Record<string, unknown>[];
    expect(lines.length).toBeGreaterThanOrEqual(3);
    expect(lines[0]).not.toHaveProperty('importe');
    expect(['21', '10']).toContain(lines[0]?.['iva']);
  });

  it('el nombre, el email y el NIF de un bloque concuerdan', () => {
    const data = generateData(documentTypes.get('presupuesto')!.schema, createRng(9), TODAY);
    expect(String(data['emisor.nombre'])).toContain(',');
    expect(String(data['emisor.nif'])).toMatch(/^B\d{8}$/);
    expect(String(data['emisor.email'])).toMatch(/@.+\.test$/);
  });
});

describe('diseño aleatorio', () => {
  for (const type of documentTypes.list()) {
    it(`${type.id}: es completo, reproducible y usa tema y fuente del catálogo`, () => {
      const a = randomDesign(type, createRng(11), TODAY);
      const b = randomDesign(type, createRng(11), TODAY);
      expect(a).toEqual(b);
      expect(THEMES.map((t) => t.palette)).toContainEqual(a.template.document.palette);
      for (const el of a.template.document.elements) {
        const family = el.props['fontFamily'];
        if (typeof family === 'string') expect(fontById(family), family).toBeDefined();
      }
      expect(Object.keys(a.data).length).toBeGreaterThan(0);
      expect(a.summary).toContain(',');
    });
  }

  it('semillas distintas dan diseños distintos', () => {
    const type = documentTypes.get('presupuesto')!;
    const palettes = new Set(
      Array.from({ length: 30 }, (_, i) => randomDesign(type, createRng(i), TODAY).summary),
    );
    expect(palettes.size).toBeGreaterThan(5);
  });
});
