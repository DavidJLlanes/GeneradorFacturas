import { describe, expect, it } from 'vitest';
import { createStore } from './create-store';

describe('createStore', () => {
  it('guarda, actualiza y notifica solo si hay cambio', () => {
    const store = createStore({ n: 1 });
    let calls = 0;
    const off = store.subscribe(() => calls++);
    store.update((s) => ({ n: s.n + 1 }));
    store.set(store.get());
    expect(store.get().n).toBe(2);
    expect(calls).toBe(1);
    off();
    store.set({ n: 9 });
    expect(calls).toBe(1);
  });
});
