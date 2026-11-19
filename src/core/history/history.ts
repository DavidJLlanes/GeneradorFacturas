// Historial deshacer/rehacer sobre estados inmutables. No tiene límite.
// Para arrastres se usa un estado "transitorio": se ve en pantalla pero solo se
// guarda en el historial al confirmarlo, de modo que un arrastre es un único paso.

export class History<T> {
  private present: T;
  private past: T[] = [];
  private future: T[] = [];
  private base: T | null = null;
  private listeners = new Set<() => void>();

  constructor(initial: T) {
    this.present = initial;
  }

  get(): T {
    return this.present;
  }

  get canUndo(): boolean {
    return this.past.length > 0;
  }

  get canRedo(): boolean {
    return this.future.length > 0;
  }

  push(next: T): void {
    if (Object.is(next, this.present)) return;
    this.past.push(this.present);
    this.future = [];
    this.present = next;
    this.emit();
  }

  undo(): boolean {
    this.cancelTransient();
    const prev = this.past.pop();
    if (prev === undefined) return false;
    this.future.push(this.present);
    this.present = prev;
    this.emit();
    return true;
  }

  redo(): boolean {
    this.cancelTransient();
    const next = this.future.pop();
    if (next === undefined) return false;
    this.past.push(this.present);
    this.present = next;
    this.emit();
    return true;
  }

  beginTransient(): void {
    if (this.base === null) this.base = this.present;
  }

  setTransient(next: T): void {
    this.present = next;
    this.emit();
  }

  commitTransient(): void {
    if (this.base === null) return;
    const base = this.base;
    this.base = null;
    if (!Object.is(base, this.present)) {
      this.past.push(base);
      this.future = [];
    }
    this.emit();
  }

  cancelTransient(): void {
    if (this.base === null) return;
    this.present = this.base;
    this.base = null;
    this.emit();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    this.listeners.forEach((fn) => fn());
  }
}
