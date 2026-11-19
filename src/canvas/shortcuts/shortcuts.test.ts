import { describe, expect, it } from 'vitest';
import { SHORTCUTS } from './shortcut-table';

describe('tabla de atajos', () => {
  it('no tiene dos atajos con la misma combinación', () => {
    const seen = new Set<string>();
    for (const s of SHORTCUTS) {
      for (const key of [...(s.keys ?? []), ...(s.codes ?? [])]) {
        const id = `${key}|mod:${s.mod ?? false}|shift:${s.shift ?? 'any'}`;
        expect(seen.has(id), id).toBe(false);
        seen.add(id);
      }
    }
  });
});
