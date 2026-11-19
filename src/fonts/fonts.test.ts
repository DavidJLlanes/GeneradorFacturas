// @vitest-environment happy-dom
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { FONTS, fontById, fontStack } from './catalog';
import { fontFaceCss } from './font-faces';
import { ensureFont } from './load-font';
import { searchFonts } from './search-fonts';

describe('catálogo de fuentes', () => {
  it('ids y nombres únicos, y siempre el peso normal', () => {
    expect(new Set(FONTS.map((f) => f.id)).size).toBe(FONTS.length);
    expect(new Set(FONTS.map((f) => f.name)).size).toBe(FONTS.length);
    for (const f of FONTS) expect(f.styles, f.id).toContain('400');
  });

  it('cada familia tiene su paquete instalado con licencia', () => {
    for (const f of FONTS) {
      expect(existsSync(join('node_modules/@fontsource', f.id, 'LICENSE')), f.id).toBe(true);
    }
  });

  it('la pila de una fuente incluye alternativa; sin fuente, hereda', () => {
    expect(fontStack('inter')).toBe('"Inter", system-ui, sans-serif');
    expect(fontStack('merriweather')).toMatch(/^"Merriweather", Georgia/);
    expect(fontStack('')).toBe('inherit');
    expect(fontStack('no-existe')).toBe('inherit');
  });
});

describe('reglas @font-face', () => {
  it('una regla por estilo y subconjunto, con rango unicode y ruta base', () => {
    const css = fontFaceCss(fontById('inter')!, '/factura/fonts/');
    expect(css.match(/@font-face/g)).toHaveLength(8);
    expect(css).toContain('url("/factura/fonts/inter/inter-latin-700-italic.woff2")');
    expect(css).toContain('unicode-range:U+0000-00FF');
    expect(css).toContain('font-display:swap');
  });

  it('una fuente sin cursivas solo declara lo que tiene', () => {
    const css = fontFaceCss(fontById('bebas-neue')!, '/f/');
    expect(css.match(/@font-face/g)).toHaveLength(2);
    expect(css).not.toContain('italic');
  });
});

describe('carga bajo demanda', () => {
  beforeEach(() => document.head.replaceChildren());

  it('declara la fuente una sola vez', () => {
    ensureFont('lora');
    ensureFont('lora');
    expect(document.head.querySelectorAll('style[data-font="lora"]')).toHaveLength(1);
  });

  it('ignora la fuente del sistema y las desconocidas', () => {
    ensureFont('');
    ensureFont('nada');
    expect(document.head.querySelectorAll('style')).toHaveLength(0);
  });
});

describe('búsqueda', () => {
  it('sin texto devuelve todo; con texto, ignora mayúsculas y acentos', () => {
    expect(searchFonts('')).toHaveLength(FONTS.length);
    expect(searchFonts('PLAYFAIR').map((f) => f.id)).toEqual(['playfair-display']);
    expect(searchFonts('mono').every((f) => /mono/i.test(f.name))).toBe(true);
  });

  it('filtra por categoría y devuelve vacío si no hay coincidencias', () => {
    expect(searchFonts('', 'script').map((f) => f.id)).toEqual(['dancing-script', 'caveat']);
    expect(searchFonts('zzz')).toEqual([]);
  });
});
