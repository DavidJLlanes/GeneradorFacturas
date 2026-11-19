import { beforeEach, describe, expect, it } from 'vitest';
import { createPage } from '../../core/document/page';
import type { DocumentModel } from '../../core/document/types';
import { fontStack } from '../catalog';
import { fontLabel } from '../font-label';
import {
  clearCustomFonts,
  customFontFaceCss,
  customFontsUsedBy,
  listCustomFonts,
  registerCustomFont,
} from './custom-fonts';
import { fontFromBytes, sniffFontMime } from './read-font-file';

const woff2 = (extra = 0): Uint8Array =>
  Uint8Array.from([0x77, 0x4f, 0x46, 0x32, ...Array.from({ length: 20 + extra }, (_, i) => i)]);

beforeEach(() => clearCustomFonts());

describe('lectura de fuentes propias', () => {
  it('reconoce los formatos por sus primeros bytes', () => {
    expect(sniffFontMime(woff2())).toBe('font/woff2');
    expect(sniffFontMime(Uint8Array.from([0, 1, 0, 0, 9]))).toBe('font/ttf');
    expect(sniffFontMime(Uint8Array.from([0x4f, 0x54, 0x54, 0x4f]))).toBe('font/otf');
    expect(sniffFontMime(Uint8Array.from([1, 2, 3, 4]))).toBeNull();
  });

  it('crea la fuente con un id estable y el nombre del archivo', () => {
    const a = fontFromBytes('Mi_Fuente-Bold.woff2', woff2());
    expect(a.name).toBe('Mi Fuente Bold');
    expect(a.id.startsWith('custom:')).toBe(true);
    expect(fontFromBytes('otro.woff2', woff2()).id).toBe(a.id);
    expect(fontFromBytes('otro.woff2', woff2(5)).id).not.toBe(a.id);
  });

  it('rechaza lo que no es una fuente o pesa demasiado', () => {
    expect(() => fontFromBytes('x.txt', Uint8Array.from([1, 2, 3, 4]))).toThrow(/no es una fuente/);
    expect(() => fontFromBytes('x.woff2', new Uint8Array(1_600_000))).toThrow(/pesa demasiado/);
  });
});

describe('registro de fuentes propias', () => {
  it('se usan por su id en la pila de fuentes y en el nombre', () => {
    const font = fontFromBytes('Marca.woff2', woff2());
    registerCustomFont(font);
    expect(fontStack(font.id)).toBe(`"${font.id}", sans-serif`);
    expect(fontLabel(font.id)).toBe('Marca');
    expect(customFontFaceCss(font)).toContain(`font-family:"${font.id}"`);
    expect(customFontFaceCss(font)).toContain('format("woff2")');
  });

  it('un documento solo arrastra las que usa', () => {
    const used = fontFromBytes('Usada.woff2', woff2());
    const spare = fontFromBytes('Sobra.woff2', woff2(3));
    registerCustomFont(used);
    registerCustomFont(spare);
    const doc: DocumentModel = {
      page: createPage(210, 297),
      elements: [
        {
          id: 'a',
          name: 'a',
          locked: false,
          hidden: false,
          kind: 'text',
          x: 0,
          y: 0,
          w: 10,
          h: 10,
          props: { fontFamily: used.id },
        },
      ],
    };
    expect(customFontsUsedBy(doc).map((f) => f.id)).toEqual([used.id]);
    expect(listCustomFonts()).toHaveLength(2);
  });
});
