import { describe, expect, it } from 'vitest';
import { frame, piece, repeating, rule, text, withFont } from './pieces';

describe('kit de plantillas', () => {
  it('piece coloca la caja y deja la pieza libre y visible', () => {
    expect(piece('a', 'A', 'text', [1, 2, 3, 4], { x: 1 })).toEqual({
      id: 'a',
      name: 'A',
      kind: 'text',
      props: { x: 1 },
      x: 1,
      y: 2,
      w: 3,
      h: 4,
      locked: false,
      hidden: false,
    });
  });

  it('withFont solo toca las piezas con texto y respeta la fuente propia', () => {
    const out = withFont(
      [
        text('t', 'T', [0, 0, 1, 1], {}),
        text('u', 'U', [0, 0, 1, 1], { fontFamily: 'lora' }),
        rule('r', [0, 0, 1, 1], '@primary'),
      ],
      'inter',
    );
    expect(out[0]?.props['fontFamily']).toBe('inter');
    expect(out[1]?.props['fontFamily']).toBe('lora');
    expect(out[2]?.props).not.toHaveProperty('fontFamily');
  });

  it('repeating marca la repetición y frame es un recuadro sin relleno', () => {
    expect(repeating(text('t', 'T', [0, 0, 1, 1], {})).repeat).toBe(true);
    const f = frame('f', 'F', [0, 0, 5, 5], '@line');
    expect(f.kind).toBe('shape');
    expect(f.props).toMatchObject({ filled: false, bordered: true, stroke: '@line' });
  });
});
