import { describe, expect, it } from 'vitest';
import { opensFilled } from './initial-view';

describe('vista inicial', () => {
  it('abre con datos solo si la dirección lo pide', () => {
    expect(opensFilled('#tipo=parte&vista=datos')).toBe(true);
    expect(opensFilled('#vista=datos')).toBe(true);
    expect(opensFilled('#tipo=parte')).toBe(false);
    expect(opensFilled('')).toBe(false);
  });
});
