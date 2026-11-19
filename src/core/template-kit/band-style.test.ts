import { describe, expect, it } from 'vitest';
import { createPage } from '../document/page';
import type { DocumentTemplate } from '../document-type/types';
import { bandStyle } from './band-style';
import { piece, text } from './pieces';

const base: DocumentTemplate = {
  id: 'clasica',
  name: 'Clásica',
  document: {
    page: createPage(210, 297),
    elements: [
      text('titulo', 'Título', [105, 10, 95, 13], { text: 'X', color: '@primary' }),
      text('numero', 'Número', [105, 24, 95, 7], { text: 'Nº', color: '@text' }),
      text('otro', 'Otro', [10, 40, 50, 7], { text: 'Y', color: '@text' }),
      piece('tabla', 'Tabla', 'table', [10, 100, 190, 80]),
    ],
  },
};

describe('estilo con banda', () => {
  const out = bandStyle(base, { id: 'moderna', name: 'Moderna' });

  it('añade una banda a todo el ancho, repetida y por debajo de todo', () => {
    const first = out.document.elements[0];
    expect(first).toMatchObject({
      id: 'banda',
      kind: 'shape',
      x: 0,
      y: 0,
      w: 210,
      h: 33,
      repeat: true,
    });
    expect(out.document.elements).toHaveLength(base.document.elements.length + 1);
  });

  it('escribe en blanco solo el título y el número', () => {
    const color = (id: string) => out.document.elements.find((e) => e.id === id)?.props['color'];
    expect(color('titulo')).toBe('@onPrimary');
    expect(color('numero')).toBe('@onPrimary');
    expect(color('otro')).toBe('@text');
  });

  it('cambia id y nombre sin tocar la plantilla original', () => {
    expect([out.id, out.name]).toEqual(['moderna', 'Moderna']);
    expect(base.document.elements.find((e) => e.id === 'titulo')?.props['color']).toBe('@primary');
    expect(base.document.elements).toHaveLength(4);
  });

  it('admite otra altura de banda', () => {
    const tall = bandStyle(base, { id: 'm', name: 'M', height: 40 });
    expect(tall.document.elements[0]?.h).toBe(40);
  });
});
