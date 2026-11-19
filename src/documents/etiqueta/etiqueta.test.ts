import { describe, expect, it } from 'vitest';
import definition from './index';

describe('etiqueta', () => {
  it('no necesita cálculos y su plantilla mide 100 × 60 mm', () => {
    expect(definition.compute).toBeUndefined();
    const page = definition.templates[0]?.document.page;
    expect([page?.widthMm, page?.heightMm]).toEqual([100, 60]);
  });

  it('el código QR lleva el campo «codigo»', () => {
    const qr = definition.templates[0]?.document.elements.find((e) => e.kind === 'qr');
    expect(qr?.props['content']).toBe('{{codigo}}');
  });
});
