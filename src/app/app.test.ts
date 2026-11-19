import { describe, expect, it } from 'vitest';
import { createPage } from '../core/document/page';
import { createRegistry } from '../core/document-type/registry';
import type { DocumentTypeDefinition } from '../core/document-type/types';
import { chooseTemplate, chooseType } from './choose-type';
import { createAppEditor } from './create-app-editor';

const def = (id: string, extra: Partial<DocumentTypeDefinition> = {}): DocumentTypeDefinition => ({
  id,
  name: id.toUpperCase(),
  description: 'd',
  defaultPaperId: 'a4',
  numbering: { prefix: 'X', padding: 3 },
  schema: { version: 1, fields: [{ key: 'a', label: 'A', kind: 'text', group: 'g' }] },
  labels: {},
  templates: [{ id: 't', name: 'T', document: { page: createPage(210, 297), elements: [] } }],
  ...extra,
});
const registry = createRegistry(
  [def('zeta'), def('beta', { internal: true }), def('alfa')].map((definition) => ({
    folder: definition.id,
    definition,
  })),
);

describe('tipo de arranque', () => {
  it('sin petición, el primero que no sea interno', () => {
    expect(chooseType(registry, '').id).toBe('alfa');
  });

  it('respeta #tipo=… y permite abrir uno interno si se pide', () => {
    expect(chooseType(registry, '#tipo=zeta').id).toBe('zeta');
    expect(chooseType(registry, '#tipo=beta').id).toBe('beta');
  });

  it('un tipo desconocido cae al primero disponible', () => {
    expect(chooseType(registry, '#tipo=nada').id).toBe('alfa');
  });

  it('falla con mensaje claro si solo hay tipos internos', () => {
    const only = createRegistry([{ folder: 'beta', definition: def('beta', { internal: true }) }]);
    expect(() => chooseType(only, '')).toThrow(/ningún tipo/);
  });
});

describe('editor de la aplicación', () => {
  it('parte de la primera plantilla, con esquema y datos de muestra del tipo', () => {
    const editor = createAppEditor(def('x', { sampleData: { a: 'hola' } }));
    expect(editor.doc().page.widthMm).toBe(210);
    expect(editor.ui.get().schema?.fields[0]?.key).toBe('a');
    expect(editor.ui.get().sample).toEqual({ a: 'hola' });
    expect(editor.ui.get().data).toEqual({});
  });

  it('falla si el tipo no tiene plantillas', () => {
    expect(() => createAppEditor(def('x', { templates: [] }))).toThrow(/plantillas/);
  });
});

describe('plantilla de arranque', () => {
  const two = def('dos', {
    templates: [
      { id: 'a', name: 'A', document: { page: createPage(210, 297), elements: [] } },
      { id: 'b', name: 'B', document: { page: createPage(148, 210), elements: [] } },
    ],
  });

  it('la primera por defecto, la pedida con #plantilla=…, y la primera si no existe', () => {
    expect(chooseTemplate(two, '').id).toBe('a');
    expect(chooseTemplate(two, '#tipo=dos&plantilla=b').id).toBe('b');
    expect(chooseTemplate(two, '#plantilla=nada').id).toBe('a');
  });

  it('el editor arranca con la plantilla elegida', () => {
    const editor = createAppEditor(two, chooseTemplate(two, '#plantilla=b'));
    expect(editor.doc().page.widthMm).toBe(148);
  });
});
