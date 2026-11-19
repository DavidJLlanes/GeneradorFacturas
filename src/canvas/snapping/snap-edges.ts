export interface EdgeSnap {
  delta: number;
  target: number;
}

// Busca el par (borde, objetivo) más cercano dentro del umbral.
export function snapEdges(
  values: readonly number[],
  targets: readonly number[],
  threshold: number,
): EdgeSnap | null {
  let best: EdgeSnap | null = null;
  for (const value of values) {
    for (const target of targets) {
      const delta = target - value;
      if (Math.abs(delta) <= threshold && (!best || Math.abs(delta) < Math.abs(best.delta))) {
        best = { delta, target };
      }
    }
  }
  return best;
}
