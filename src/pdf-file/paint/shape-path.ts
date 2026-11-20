// Contorno de un rectángulo (con esquinas redondeadas u ovalado) como lista de segmentos en
// coordenadas locales con el origen arriba a la izquierda. De ahí salen la cadena SVG que dibuja
// el relleno y las operaciones PDF que recortan.

export type Seg =
  | readonly ['M', number, number]
  | readonly ['L', number, number]
  | readonly ['C', number, number, number, number, number, number]
  | readonly ['Z'];

const KAPPA = 0.5522847498;

export function roundedRect(w: number, h: number, rxIn: number, ryIn: number): Seg[] {
  const rx = Math.max(0, Math.min(rxIn, w / 2));
  const ry = Math.max(0, Math.min(ryIn, h / 2));
  if (rx === 0 || ry === 0) {
    return [['M', 0, 0], ['L', w, 0], ['L', w, h], ['L', 0, h], ['Z']];
  }
  const kx = rx * KAPPA;
  const ky = ry * KAPPA;
  return [
    ['M', rx, 0],
    ['L', w - rx, 0],
    ['C', w - rx + kx, 0, w, ry - ky, w, ry],
    ['L', w, h - ry],
    ['C', w, h - ry + ky, w - rx + kx, h, w - rx, h],
    ['L', rx, h],
    ['C', rx - kx, h, 0, h - ry + ky, 0, h - ry],
    ['L', 0, ry],
    ['C', 0, ry - ky, rx - kx, 0, rx, 0],
    ['Z'],
  ];
}

const num = (n: number): string => String(Math.round(n * 1000) / 1000);

export function toSvgPath(segs: readonly Seg[]): string {
  return segs
    .map((s) =>
      s[0] === 'Z'
        ? 'Z'
        : `${s[0]}${s
            .slice(1)
            .map((n) => num(n as number))
            .join(' ')}`,
    )
    .join(' ');
}
