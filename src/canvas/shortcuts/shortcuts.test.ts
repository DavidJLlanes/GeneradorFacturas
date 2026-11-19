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

  it('con la vista "Con datos" solo siguen activos los atajos de vista', () => {
    const active = SHORTCUTS.filter((s) => s.view).flatMap((s) => [
      ...(s.keys ?? []),
      ...(s.codes ?? []),
    ]);
    expect(active).toEqual(expect.arrayContaining(['+', '-', 'pageup', 'pagedown', 'Digit1']));
    for (const edit of ['delete', 'backspace', 'arrowleft', 'd', 'a', 'z', 'l', 'h']) {
      expect(active, edit).not.toContain(edit);
    }
  });
});
