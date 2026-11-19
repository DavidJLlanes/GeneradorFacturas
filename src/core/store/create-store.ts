export interface Store<T> {
  get(): T;
  set(next: T): void;
  update(fn: (current: T) => T): void;
  subscribe(listener: () => void): () => void;
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();

  const set = (next: T): void => {
    if (Object.is(next, state)) return;
    state = next;
    listeners.forEach((fn) => fn());
  };

  return {
    get: () => state,
    set,
    update: (fn) => set(fn(state)),
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
