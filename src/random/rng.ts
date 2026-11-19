// Generador de números aleatorios con semilla (mulberry32): la misma semilla da siempre la misma
// secuencia, así un resultado «aleatorio» se puede repetir y probar.
export interface Rng {
  /** Número en [0, 1). */
  next(): number;
  /** Entero en [min, max] (ambos incluidos). */
  int(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
  chance(probability: number): boolean;
}

export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number): number => min + Math.floor(next() * (max - min + 1));
  return {
    next,
    int,
    pick: <T>(items: readonly T[]): T => {
      const item = items[int(0, items.length - 1)];
      if (item === undefined) throw new Error('No se puede elegir de una lista vacía.');
      return item;
    },
    chance: (probability) => next() < probability,
  };
}
