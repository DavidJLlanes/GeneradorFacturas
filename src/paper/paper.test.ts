import { describe, expect, it } from 'vitest';
import { createPage } from '../core/document/page';
import type { DocElement } from '../core/document/types';
import { adaptElements } from './adapt-elements';
import { clampMargins } from './margins';
import { matchPreset } from './match-preset';
import { orientationOf, withOrientation } from './orientation';
import { PAPER_PRESETS, presetById } from './paper-presets';
import { paperLabel } from './paper-label';
import { pageForPreset, pageWithMargins, pageWithSize } from './page-builders';
import { MAX_PAGE_MM, MIN_PAGE_MM, clampPageSize } from './size-limits';

const el = (x: number, y: number, w: number, h: number): DocElement => ({
  id: 'a',
  name: 'a',
  x,
  y,
  w,
  h,
  locked: false,
  hidden: false,
  kind: 'shape',
  props: {},
});

describe('catálogo de papeles', () => {
  it('tiene ids únicos y medidas en vertical', () => {
    const ids = PAPER_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of PAPER_PRESETS) expect(p.widthMm).toBeLessThanOrEqual(p.heightMm);
  });

  it('incluye los papeles pedidos', () => {
    for (const id of [
      'a3',
      'a4',
      'a5',
      'a6',
      'letter',
      'legal',
      'ticket-80',
      'ticket-58',
      'square',
    ]) {
      expect(presetById(id), id).toBeDefined();
    }
  });

  it('los tickets son de largo continuo', () => {
    expect(presetById('ticket-80')?.continuous).toBe(true);
    expect(presetById('ticket-58')?.widthMm).toBe(58);
  });
});

describe('reconocer el papel', () => {
  it('detecta un papel en vertical y en horizontal', () => {
    expect(matchPreset(createPage(210, 297))?.id).toBe('a4');
    expect(matchPreset(createPage(297, 210))?.id).toBe('a4');
    expect(matchPreset(createPage(215.9, 279.4))?.id).toBe('letter');
  });

  it('un ticket se reconoce por el ancho, con cualquier largo', () => {
    expect(matchPreset(createPage(80, 640))?.id).toBe('ticket-80');
  });

  it('medidas libres son personalizadas', () => {
    expect(matchPreset(createPage(123, 456))).toBeNull();
  });
});

describe('orientación', () => {
  it('intercambia ancho y alto', () => {
    const landscape = withOrientation(createPage(210, 297), 'landscape');
    expect([landscape.widthMm, landscape.heightMm]).toEqual([297, 210]);
    expect(orientationOf(landscape)).toBe('landscape');
    expect(withOrientation(landscape, 'landscape')).toBe(landscape);
  });

  it('un cuadrado no cambia', () => {
    const square = createPage(200, 200);
    expect(withOrientation(square, 'landscape')).toBe(square);
  });
});

describe('constructores de página', () => {
  it('cambiar de papel conserva la orientación horizontal', () => {
    const next = pageForPreset(createPage(297, 210), presetById('a5')!);
    expect([next.widthMm, next.heightMm]).toEqual([210, 148]);
  });

  it('un ticket siempre queda vertical con el largo por defecto', () => {
    const next = pageForPreset(createPage(297, 210), presetById('ticket-80')!);
    expect([next.widthMm, next.heightMm]).toEqual([80, 200]);
  });

  it('limita el tamaño personalizado', () => {
    expect(clampPageSize(5)).toBe(MIN_PAGE_MM);
    expect(clampPageSize(99999)).toBe(MAX_PAGE_MM);
    expect(clampPageSize(NaN)).toBe(MIN_PAGE_MM);
    const page = pageWithSize(createPage(210, 297), 100.456, 5);
    expect([page.widthMm, page.heightMm]).toEqual([100.46, MIN_PAGE_MM]);
  });

  it('los márgenes se recortan cuando el papel es pequeño', () => {
    const small = pageForPreset(createPage(210, 297, 40), presetById('ticket-58')!);
    expect(small.marginsMm.left + small.marginsMm.right).toBeLessThanOrEqual(58 - 10);
  });
});

describe('márgenes', () => {
  it('no admite negativos ni cubrir toda la página', () => {
    const m = clampMargins({ top: -5, right: 90, bottom: 0, left: 90 }, 100, 100);
    expect(m.top).toBe(0);
    expect(m.left + m.right).toBeLessThanOrEqual(90);
    expect(m.left).toBeCloseTo(m.right);
  });

  it('respeta márgenes válidos tal cual', () => {
    const page = pageWithMargins(createPage(210, 297), { top: 5, right: 6, bottom: 7, left: 8 });
    expect(page.marginsMm).toEqual({ top: 5, right: 6, bottom: 7, left: 8 });
  });
});

describe('adaptar piezas', () => {
  const from = { widthMm: 210, heightMm: 297 };

  it('keep no toca nada', () => {
    const items = [el(10, 10, 50, 50)];
    expect(adaptElements(items, from, { widthMm: 100, heightMm: 100 }, 'keep')).toBe(items);
  });

  it('stretch escala cada eje', () => {
    const [out] = adaptElements(
      [el(21, 29.7, 105, 148.5)],
      from,
      { widthMm: 105, heightMm: 594 },
      'stretch',
    );
    expect(out).toMatchObject({ x: 10.5, y: 59.4, w: 52.5, h: 297 });
  });

  it('fit escala igual en los dos ejes y centra', () => {
    const [out] = adaptElements([el(0, 0, 210, 297)], from, { widthMm: 297, heightMm: 210 }, 'fit');
    // factor = 210/297; el cuadro entero queda centrado horizontalmente
    expect(out!.w / out!.h).toBeCloseTo(210 / 297);
    expect(out!.y).toBeCloseTo(0);
    expect(out!.x).toBeCloseTo((297 - out!.w) / 2);
  });

  it('un papel del mismo tamaño no cambia las piezas', () => {
    const items = [el(1, 2, 3, 4)];
    expect(adaptElements(items, from, from, 'stretch')).toBe(items);
  });
});

describe('etiqueta del papel', () => {
  it('describe el papel actual', () => {
    expect(paperLabel(createPage(210, 297))).toBe('A4 vertical');
    expect(paperLabel(createPage(297, 210))).toBe('A4 horizontal');
    expect(paperLabel(createPage(80, 200))).toBe('Ticket 80 mm · 200 mm de largo');
    expect(paperLabel(createPage(123, 456))).toBe('123 × 456 mm');
    expect(paperLabel(createPage(200, 200))).toBe('Cuadrado');
  });
});
