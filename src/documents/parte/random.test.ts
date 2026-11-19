import { describe, expect, it } from 'vitest';
import { createRng } from '../../random/rng';
import { compute, minutesOf } from './calc';
import { refineRandomData } from './random';

describe('datos aleatorios del parte', () => {
  it('la hora de fin siempre es posterior a la de inicio y hay duración', () => {
    for (let seed = 0; seed < 100; seed += 1) {
      const data = refineRandomData({ tecnico: 'x' }, createRng(seed));
      const start = minutesOf(data['horaInicio']);
      const end = minutesOf(data['horaFin']);
      expect(start).not.toBeNull();
      expect(end).not.toBeNull();
      expect(end!).toBeGreaterThan(start!);
      expect(compute(data)['duracion']).not.toBe('');
    }
  });

  it('conserva el resto de datos', () => {
    expect(refineRandomData({ tecnico: 'Luis' }, createRng(1))['tecnico']).toBe('Luis');
  });
});
