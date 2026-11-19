import { describe, expect, it } from 'vitest';
import type { PropSpec } from '../pieces/types';
import { DEFAULT_PALETTE, PALETTE_KEYS, paletteOf, samePalette } from './palette';
import { paletteKeyOf, resolveColor, resolveColorProps, tokenOf } from './resolve-color';
import { matchTheme, themeById, THEMES } from './themes';

const palette = { ...DEFAULT_PALETTE, primary: '#123456' };

describe('colores enlazados a la paleta', () => {
  it('reconoce los nombres de la paleta y nada más', () => {
    expect(paletteKeyOf('@primary')).toBe('primary');
    expect(paletteKeyOf('@onPrimary')).toBe('onPrimary');
    expect(paletteKeyOf('@nada')).toBeNull();
    expect(paletteKeyOf('#ffffff')).toBeNull();
    expect(paletteKeyOf(3)).toBeNull();
  });

  it('resuelve un enlace a su color y deja pasar los colores propios', () => {
    expect(resolveColor(tokenOf('primary'), palette)).toBe('#123456');
    expect(resolveColor('#abcdef', palette)).toBe('#abcdef');
    expect(resolveColor('@nada', palette)).toBe('@nada');
  });

  const specs: PropSpec[] = [
    { key: 'a', label: 'A', kind: 'color' },
    { key: 'b', label: 'B', kind: 'color' },
    { key: 'c', label: 'C', kind: 'text' },
  ];

  it('solo sustituye en propiedades de tipo color', () => {
    const out = resolveColorProps({ a: '@primary', b: '#fff', c: '@primary' }, specs, palette);
    expect(out).toEqual({ a: '#123456', b: '#fff', c: '@primary' });
  });

  it('sin enlaces devuelve el mismo objeto', () => {
    const props = { a: '#000', b: '#fff' };
    expect(resolveColorProps(props, specs, palette)).toBe(props);
  });
});

describe('paleta y temas', () => {
  it('un documento sin paleta usa la de por defecto', () => {
    expect(paletteOf({})).toBe(DEFAULT_PALETTE);
    expect(paletteOf({ palette })).toBe(palette);
  });

  it('compara paletas color a color', () => {
    expect(samePalette(DEFAULT_PALETTE, { ...DEFAULT_PALETTE })).toBe(true);
    expect(samePalette(DEFAULT_PALETTE, palette)).toBe(false);
  });

  it('todos los temas tienen todos los colores, en hexadecimal, y ids únicos', () => {
    expect(new Set(THEMES.map((t) => t.id)).size).toBe(THEMES.length);
    for (const t of THEMES) {
      for (const key of PALETTE_KEYS) expect(t.palette[key]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('el primer tema es la paleta por defecto', () => {
    expect(THEMES[0]?.palette).toEqual(DEFAULT_PALETTE);
  });

  it('encuentra un tema por id y detecta si la paleta es de un tema', () => {
    expect(themeById('azul')?.name).toBe('Azul');
    expect(themeById('x')).toBeUndefined();
    expect(matchTheme(themeById('verde')!.palette)?.id).toBe('verde');
    expect(matchTheme(palette)).toBeNull();
  });
});
