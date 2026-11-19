export type HandleId = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export const HANDLE_IDS: readonly HandleId[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

export const isHandleId = (value: unknown): value is HandleId =>
  typeof value === 'string' && (HANDLE_IDS as readonly string[]).includes(value);

// Posición del tirador dentro del cuadro, en fracciones (0, 0.5 o 1).
export function handlePosition(handle: HandleId): { fx: number; fy: number } {
  return {
    fx: handle.includes('w') ? 0 : handle.includes('e') ? 1 : 0.5,
    fy: handle.includes('n') ? 0 : handle.includes('s') ? 1 : 0.5,
  };
}
