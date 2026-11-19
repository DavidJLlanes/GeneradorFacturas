import { describe, expect, it } from 'vitest';
import { createPage } from '../document/page';
import { discoverTypes, documentTypes } from './discover';
import { createRegistry } from './registry';
import type { DocumentTypeDefinition } from './types';
import { validateDocumentType } from './validate';

const valid = (): DocumentTypeDefinition => ({
  id: 'prueba',
  name: 'Prueba',
  description: 'Tipo de prueba',
  defaultPaperId: 'a4',
  numbering: { prefix: 'P-', padding: 4 },
  schema: {
    version: 1,
    fields: [{ key: 'cliente.nombre', label: 'Nombre', kind: 'text', group: 'Cliente' }],
  },
  labels: { titulo: 'Prueba' },
  templates: [{ id: 'base', name: 'Base', document: { page: createPage(210, 297), elements: [] } }],
});

describe('validateDocumentType', () => {
  it('acepta una definición correcta', () => {
    expect(validateDocumentType(valid(), 'prueba')).toEqual([]);
  });

  it('detecta id que no coincide con la carpeta', () => {
    expect(validateDocumentType(valid(), 'otra').join()).toMatch(/no coincide/);
  });

  it('detecta papel, numeración y esquema inválidos', () => {
    const def = valid();
    const broken: DocumentTypeDefinition = {
      ...def,
      id: 'Mal Id',
      defaultPaperId: 'no-existe',
      numbering: { prefix: 'P_', padding: 0 },
      schema: {
        version: 0,
        fields: [
          { key: 'A.b', label: 'x', kind: 'text', group: 'g' },
          { key: 'ok', label: 'x', kind: 'text', group: 'g' },
          { key: 'ok', label: 'x', kind: 'text', group: 'g' },
        ],
      },
    };
    const text = validateDocumentType(broken, 'Mal Id').join('\n');
    for (const part of [
      'id inválido',
      'papel por defecto',
      'prefijo',
      'padding',
      'versión',
      'clave de campo inválida',
      'repetida',
    ]) {
      expect(text, part).toContain(part);
    }
  });

  it('valida las columnas de los campos de líneas', () => {
    const def = valid();
    const lines = (columns: unknown) =>
      ({
        ...def,
        schema: {
          version: 1,
          fields: [{ key: 'l', label: 'L', kind: 'lines', group: 'g', columns }],
        },
      }) as DocumentTypeDefinition;
    const ok = [{ key: 'a', label: 'A', kind: 'text', width: 1 }];
    expect(validateDocumentType(lines(ok), 'prueba')).toEqual([]);
    expect(validateDocumentType(lines([]), 'prueba').join()).toMatch(/necesita columnas/);
    const bad = [ok[0], { ...ok[0] }, { key: 'b.c', label: '', kind: 'raro', width: 0 }];
    const text = validateDocumentType(lines(bad), 'prueba').join('\n');
    for (const part of [
      'columna repetida',
      'clave de columna inválida',
      'tipo de columna',
      'etiqueta',
      'anchura',
    ]) {
      expect(text, part).toContain(part);
    }
    const notLines = {
      ...def,
      schema: {
        version: 1,
        fields: [{ key: 'x', label: 'X', kind: 'text', group: 'g', columns: ok }],
      },
    };
    expect(validateDocumentType(notLines as DocumentTypeDefinition, 'prueba').join()).toMatch(
      /no es de líneas/,
    );
  });

  it('exige plantillas con papel válido y piezas sin ids repetidos', () => {
    const def = valid();
    expect(validateDocumentType({ ...def, templates: [] }, 'prueba').join()).toMatch(/plantilla/);
    const el = {
      id: 'a',
      name: 'a',
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      locked: false,
      hidden: false,
      kind: 'shape',
      props: {},
    };
    const t = { id: 't', name: 't', document: { page: createPage(1, 297), elements: [el, el] } };
    const text = validateDocumentType({ ...def, templates: [t] }, 'prueba').join('\n');
    expect(text).toMatch(/fuera de rango/);
    expect(text).toMatch(/repite el id de pieza/);
  });
});

describe('createRegistry', () => {
  it('lista por nombre y busca por id', () => {
    const a = { ...valid(), id: 'zeta', name: 'Zeta' };
    const b = { ...valid(), id: 'alfa', name: 'Alfa' };
    const registry = createRegistry([
      { folder: 'zeta', definition: a },
      { folder: 'alfa', definition: b },
    ]);
    expect(registry.list().map((d) => d.id)).toEqual(['alfa', 'zeta']);
    expect(registry.get('zeta')).toBe(a);
    expect(registry.get('nada')).toBeUndefined();
  });

  it('falla con mensaje claro si un tipo no es válido o está repetido', () => {
    expect(() => createRegistry([{ folder: 'x', definition: valid() }])).toThrow(/no válido/);
    const d = { folder: 'prueba', definition: valid() };
    expect(() => createRegistry([d, d])).toThrow(/repetido/);
  });
});

describe('tipos descubiertos en src/documents', () => {
  it('hay al menos uno y todos cumplen el contrato', () => {
    const found = discoverTypes();
    expect(found.length).toBeGreaterThan(0);
    for (const { folder, definition } of found) {
      expect(validateDocumentType(definition, folder), folder).toEqual([]);
    }
    expect(documentTypes.list().length).toBe(found.length);
  });

  it('valida campos de lista, columnas de lista y datos de ejemplo', () => {
    const def = valid();
    const withField = (field: object, sampleData?: object) =>
      ({
        ...def,
        sampleData,
        schema: { version: 1, fields: [{ key: 'c', label: 'C', group: 'g', ...field }] },
      }) as unknown as DocumentTypeDefinition;
    const opts = [{ value: 'a', label: 'A' }];
    expect(validateDocumentType(withField({ kind: 'choice', options: opts }), 'prueba')).toEqual(
      [],
    );
    expect(validateDocumentType(withField({ kind: 'toggle' }), 'prueba')).toEqual([]);
    expect(validateDocumentType(withField({ kind: 'choice' }), 'prueba').join()).toMatch(
      /necesita opciones/,
    );
    const dup = [...opts, ...opts];
    expect(
      validateDocumentType(withField({ kind: 'choice', options: dup }), 'prueba').join(),
    ).toMatch(/repite la opción/);
    expect(
      validateDocumentType(withField({ kind: 'text', options: opts }), 'prueba').join(),
    ).toMatch(/no es de lista/);
    const col = (c: object) =>
      withField({ kind: 'lines', columns: [{ key: 'k', label: 'K', width: 1, ...c }] });
    expect(validateDocumentType(col({ kind: 'choice', options: opts }), 'prueba')).toEqual([]);
    expect(validateDocumentType(col({ kind: 'choice' }), 'prueba').join()).toMatch(
      /necesita opciones/,
    );
    expect(validateDocumentType(withField({ kind: 'text' }, { c: 'x' }), 'prueba')).toEqual([]);
    expect(
      validateDocumentType(withField({ kind: 'text' }, { zzz: 'x' }), 'prueba').join(),
    ).toMatch(/no existe/);
  });
});
