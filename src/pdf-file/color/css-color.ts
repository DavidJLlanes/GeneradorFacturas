// Color CSS ya resuelto por el navegador (`rgb(...)`, `rgba(...)`, `#hex` o `transparent`) a
// componentes entre 0 y 1, que es lo que espera el PDF.

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

function channel(token: string): number {
  return clamp01(token.endsWith('%') ? parseFloat(token) / 100 : parseFloat(token) / 255);
}

function alpha(token: string | undefined): number {
  if (token === undefined || token === '') return 1;
  return clamp01(token.endsWith('%') ? parseFloat(token) / 100 : parseFloat(token));
}

function fromHex(hex: string): Rgba | null {
  const h = hex.length === 3 || hex.length === 4 ? [...hex].map((c) => c + c).join('') : hex;
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(h)) return null;
  const n = (i: number): number => parseInt(h.slice(i, i + 2), 16) / 255;
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
}

export function parseCssColor(value: string): Rgba | null {
  const text = value.trim().toLowerCase();
  if (text === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (text.startsWith('#')) return fromHex(text.slice(1));
  const match = /^rgba?\(([^)]*)\)$/.exec(text);
  if (!match) return null;
  const parts = (match[1] ?? '').split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;
  const [r, g, b, a] = parts as [string, string, string, string?];
  return { r: channel(r), g: channel(g), b: channel(b), a: alpha(a) };
}
