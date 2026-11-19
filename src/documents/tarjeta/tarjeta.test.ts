import { describe, expect, it } from 'vitest';
import definition from './index';

describe('tarjeta de visita', () => {
  it('mide 85 × 55 mm y no necesita cálculos', () => {
    expect(definition.compute).toBeUndefined();
    const page = definition.templates[0]?.document.page;
    expect([page?.widthMm, page?.heightMm]).toEqual([85, 55]);
  });

  it('el logo está enlazado al campo «logo»', () => {
    const logo = definition.templates[0]?.document.elements.find((e) => e.kind === 'image');
    expect(logo?.props['field']).toBe('logo');
  });
});
