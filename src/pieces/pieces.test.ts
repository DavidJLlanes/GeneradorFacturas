// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import type { DocElement } from '../core/document/types';
import { discoverPieces, pieces } from './discover';
import { createPieceRegistry } from './registry';
import type { PieceDefinition } from './types';
import { validatePiece } from './validate';

const valid = (): PieceDefinition => ({
  kind: 'prueba',
  name: 'Prueba',
  defaultSize: { w: 10, h: 10 },
  defaultProps: { text: 'a', size: 5, on: true, mode: 'x' },
  props: [
    { key: 'text', label: 'Texto', kind: 'text' },
    { key: 'size', label: 'Tamaño', kind: 'number', min: 1, max: 10 },
    { key: 'on', label: 'Activo', kind: 'toggle' },
    { key: 'mode', label: 'Modo', kind: 'select', options: [{ value: 'x', label: 'X' }] },
  ],
  render: () => undefined,
});

const el = (kind: string, props = {}): DocElement => ({
  id: 'a',
  name: 'a',
  x: 0,
  y: 0,
  w: 40,
  h: 20,
  locked: false,
  hidden: false,
  kind,
  props,
});

const draw = (kind: string, props = {}): HTMLElement => {
  const node = document.createElement('div');
  const piece = pieces.get(kind)!;
  const e = el(kind, props);
  piece.render(node, {
    props: pieces.propsOf(e),
    widthMm: e.w,
    heightMm: e.h,
    resolve: (t) => t,
    schema: null,
    value: () => undefined,
    fillMode: false,
  });
  return node;
};

describe('validatePiece', () => {
  it('acepta una pieza correcta', () => {
    expect(validatePiece(valid(), 'prueba')).toEqual([]);
  });

  it('detecta valores por defecto incoherentes', () => {
    const def: PieceDefinition = {
      ...valid(),
      defaultProps: { text: 5, size: 5, on: true, mode: 'z', extra: 1 },
    };
    const text = validatePiece(def, 'prueba').join('\n');
    expect(text).toContain('"text" debe ser string');
    expect(text).toContain('no está en sus opciones');
    expect(text).toContain('sin propiedad: "extra"');
  });

  it('detecta kind distinto de la carpeta, repetidos y listas sin opciones', () => {
    const base = valid();
    expect(validatePiece(base, 'otra').join()).toMatch(/no coincide/);
    const dup = { ...base, props: [...base.props, base.props[0]!] };
    expect(validatePiece(dup, 'prueba').join()).toMatch(/repetida/);
    const noOptions = { ...base, props: [{ key: 'mode', label: 'M', kind: 'select' as const }] };
    expect(validatePiece(noOptions, 'prueba').join()).toMatch(/sin opciones|no tiene opciones/);
  });
});

describe('registro de piezas', () => {
  it('rechaza piezas inválidas o repetidas', () => {
    expect(() => createPieceRegistry([{ folder: 'x', definition: valid() }])).toThrow(/no válida/);
    const d = { folder: 'prueba', definition: valid() };
    expect(() => createPieceRegistry([d, d])).toThrow(/repetida/);
  });

  it('completa las propiedades con los valores por defecto', () => {
    const registry = createPieceRegistry([{ folder: 'prueba', definition: valid() }]);
    expect(registry.propsOf(el('prueba', { size: 9 }))).toEqual({
      text: 'a',
      size: 9,
      on: true,
      mode: 'x',
    });
  });

  it('todas las piezas descubiertas cumplen el contrato', () => {
    const found = discoverPieces();
    for (const kind of ['text', 'shape', 'line']) expect(pieces.get(kind), kind).toBeDefined();
    for (const { folder, definition } of found) {
      expect(validatePiece(definition, folder), folder).toEqual([]);
    }
  });
});

describe('dibujo de piezas', () => {
  it('el texto se escribe como texto, nunca como HTML', () => {
    const node = draw('text', { text: '<b>hola</b>\nmundo', bold: true, fontSize: 12 });
    expect(node.textContent).toBe('<b>hola</b>\nmundo');
    expect(node.querySelector('b')).toBeNull();
    expect(node.style.fontWeight).toBe('700');
    expect(parseFloat(node.style.fontSize)).toBeCloseTo(16);
  });

  it('la forma cambia relleno, borde y elipse', () => {
    const node = draw('shape', { shape: 'ellipse', filled: false, bordered: false });
    expect(node.style.borderRadius).toBe('50%');
    expect(node.style.background).toBe('transparent');
    expect(node.style.border).toMatch(/none/);
  });

  it('la línea dibuja un solo trazo con el grosor y el estilo pedidos', () => {
    const node = draw('line', { orientation: 'diagonal-up', style: 'dashed', thickness: 1 });
    const line = node.querySelector('line')!;
    expect(node.querySelectorAll('line').length).toBe(1);
    expect(line.getAttribute('stroke-dasharray')).toBeTruthy();
    expect(Number(line.getAttribute('stroke-width'))).toBeCloseTo((96 / 25.4) * 1);
    expect(Number(line.getAttribute('y1'))).toBeGreaterThan(Number(line.getAttribute('y2')));
  });

  it('la imagen usa la propia o la del campo de datos, y solo data URLs de imagen', () => {
    const png = 'data:image/png;base64,AAAA';
    const bound = 'data:image/jpeg;base64,BBBB';
    const piece = pieces.get('image')!;
    const render = (props: Record<string, string>, resolve: (t: string) => string): HTMLElement => {
      const node = document.createElement('div');
      const e = el('image', props);
      piece.render(node, {
        props: pieces.propsOf(e),
        widthMm: 40,
        heightMm: 20,
        resolve,
        schema: null,
        value: () => undefined,
        fillMode: false,
      });
      return node;
    };
    const same = (t: string): string => t;
    expect(render({ src: png }, same).querySelector('img')?.getAttribute('src')).toBe(png);
    expect(render({}, same).querySelector('img')).toBeNull();
    expect(render({ src: 'javascript:alert(1)' }, same).querySelector('img')).toBeNull();
    const filled = (t: string): string => (t === '{{logo}}' ? bound : t);
    expect(
      render({ src: png, field: 'logo' }, filled).querySelector('img')?.getAttribute('src'),
    ).toBe(bound);
    expect(
      render({ src: png, field: 'logo' }, same).querySelector('img')?.getAttribute('src'),
    ).toBe(png);
  });

  it('cabecera y pie ponen la línea en el borde que da al contenido', () => {
    const header = draw('header', { text: 'Mi empresa' });
    const footer = draw('footer');
    expect(header.textContent).toBe('Mi empresa');
    expect(header.style.borderBottom).toMatch(/solid/);
    expect(header.style.borderTop).not.toMatch(/solid/);
    expect(footer.style.borderTop).toMatch(/solid/);
    expect(footer.style.borderBottom).not.toMatch(/solid/);
  });
});
