import fontkit from '@pdf-lib/fontkit';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { outlineToSvg, type OutlineCommand } from './fonts/glyph-outline';
import { parseCssColor } from './color/css-color';
import { faceSource, firstFamily, pickStyle } from './fonts/face-source';
import { fitRect } from './image/fit-rect';
import { roundedRect, toSvgPath } from './paint/shape-path';
import { splitLines, type CharBox } from './text/split-lines';
import { FONTS } from '../fonts/catalog';

describe('parseCssColor', () => {
  it('lee rgb, rgba y hex', () => {
    expect(parseCssColor('rgb(255, 0, 0)')).toEqual({ r: 1, g: 0, b: 0, a: 1 });
    expect(parseCssColor('rgba(0, 0, 0, 0.5)')).toEqual({ r: 0, g: 0, b: 0, a: 0.5 });
    expect(parseCssColor('rgb(0 0 255 / 25%)')).toEqual({ r: 0, g: 0, b: 1, a: 0.25 });
    expect(parseCssColor('#fff')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
    expect(parseCssColor('#00000080')?.a).toBeCloseTo(0.5, 1);
  });

  it('transparent no pinta y lo desconocido es null', () => {
    expect(parseCssColor('transparent')?.a).toBe(0);
    expect(parseCssColor('papaya')).toBeNull();
    expect(parseCssColor('#12')).toBeNull();
  });
});

const chars = (text: string, top: number, left = 0): CharBox[] =>
  [...text].map((char, i) => ({
    char,
    left: left + i * 6,
    right: left + i * 6 + 6,
    top,
    bottom: top + 12,
  }));

describe('splitLines', () => {
  it('agrupa por líneas y recorta los espacios finales', () => {
    const lines = splitLines([...chars('Hola ', 0), ...chars('mundo', 14)]);
    expect(lines.map((l) => l.text)).toEqual(['Hola', 'mundo']);
    expect(lines[0]?.left).toBe(0);
    expect(lines[1]?.top).toBe(14);
  });

  it('descarta las líneas vacías', () => {
    expect(splitLines(chars('   ', 0))).toEqual([]);
  });
});

describe('shape-path', () => {
  it('un rectángulo sin radio son cuatro lados', () => {
    expect(toSvgPath(roundedRect(10, 5, 0, 0))).toBe('M0 0 L10 0 L10 5 L0 5 Z');
  });

  it('limita el radio a la mitad del lado menor y usa curvas', () => {
    const path = toSvgPath(roundedRect(10, 4, 50, 50));
    expect(path).toContain('C');
    expect(path.startsWith('M5 0')).toBe(true);
    expect(path).toContain('5 2');
  });
});

describe('fitRect', () => {
  it('contain centra sin deformar', () => {
    expect(fitRect('contain', 100, 100, 200, 100)).toEqual({ x: 0, y: 25, w: 100, h: 50 });
  });

  it('cover rellena la caja y fill la deforma', () => {
    expect(fitRect('cover', 100, 100, 200, 100)).toEqual({ x: -50, y: 0, w: 200, h: 100 });
    expect(fitRect('fill', 100, 80, 3, 3)).toEqual({ x: 0, y: 0, w: 100, h: 80 });
  });
});

describe('fuentes del PDF', () => {
  it('la primera familia sin comillas', () => {
    expect(firstFamily('"Open Sans", sans-serif')).toBe('Open Sans');
    expect(firstFamily('Georgia, serif')).toBe('Georgia');
  });

  it('elige el estilo más cercano', () => {
    const font = FONTS.find((f) => f.styles.includes('700'))!;
    expect(pickStyle(font, 700, false)).toBe('700');
    expect(pickStyle(font, 400, false)).toBeDefined();
  });

  it('una fuente del catálogo tiene un archivo por subconjunto; una desconocida, ninguno', () => {
    const font = FONTS[0]!;
    const source = faceSource(
      { family: `"${font.name}", sans-serif`, weight: 400, italic: false },
      '/x/',
    );
    expect(source?.files.length).toBe(2);
    expect(faceSource({ family: 'Georgia, serif', weight: 400, italic: false }, '/x/')).toBeNull();
  });
});

describe('contornos de glifos', () => {
  it('escala, vuelca el eje Y y desplaza', () => {
    const d = outlineToSvg(
      [
        { command: 'moveTo', args: [0, 0] },
        { command: 'lineTo', args: [100, 200] },
        { command: 'quadraticCurveTo', args: [50, 50, 0, 0] },
        { command: 'closePath', args: [] },
      ],
      0.1,
      5,
    );
    expect(d).toBe('M5 0L15 -20Q10 -5 5 0Z');
  });

  it('con fuentes reales saca el contorno de letras acentuadas', () => {
    for (const [id, style] of [
      ['inter', '400-italic'],
      ['roboto', '700-normal'],
      ['open-sans', '400-normal'],
    ] as const) {
      const bytes = new Uint8Array(
        readFileSync(`node_modules/@fontsource/${id}/files/${id}-latin-${style}.woff2`),
      );
      const kit = fontkit.create(bytes);
      const layout = kit.layout('Ñandú € é');
      const total = layout.glyphs.reduce(
        (n, g) =>
          n +
          outlineToSvg((g.path as unknown as { commands: OutlineCommand[] }).commands, 1, 0).length,
        0,
      );
      expect(total).toBeGreaterThan(100);
    }
  });
});
