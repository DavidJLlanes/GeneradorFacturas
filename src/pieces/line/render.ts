import { mmToPx } from '../../core/units/units';
import { num, str } from '../shared/props';
import type { PieceRenderInput } from '../types';

const SVG_NS = 'http://www.w3.org/2000/svg';

// Extremos de la línea según la orientación, en proporción del recuadro.
const ENDS: Record<string, [number, number, number, number]> = {
  horizontal: [0, 0.5, 1, 0.5],
  vertical: [0.5, 0, 0.5, 1],
  'diagonal-down': [0, 0, 1, 1],
  'diagonal-up': [0, 1, 1, 0],
};

export function renderLine(
  node: HTMLElement,
  { props, widthMm, heightMm }: PieceRenderInput,
): void {
  const w = mmToPx(widthMm);
  const h = mmToPx(heightMm);
  const t = Math.max(mmToPx(num(props, 'thickness')), 0.1);
  const [x1, y1, x2, y2] = ENDS[str(props, 'orientation')] ?? ENDS['horizontal']!;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', String(w));
  svg.setAttribute('height', String(h));
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.style.display = 'block';
  svg.style.overflow = 'visible';

  const line = document.createElementNS(SVG_NS, 'line');
  line.setAttribute('x1', String(x1 * w));
  line.setAttribute('y1', String(y1 * h));
  line.setAttribute('x2', String(x2 * w));
  line.setAttribute('y2', String(y2 * h));
  line.setAttribute('stroke', str(props, 'color'));
  line.setAttribute('stroke-width', String(t));
  const style = str(props, 'style');
  if (style === 'dashed') line.setAttribute('stroke-dasharray', `${t * 4} ${t * 3}`);
  if (style === 'dotted') {
    line.setAttribute('stroke-dasharray', `0 ${t * 2}`);
    line.setAttribute('stroke-linecap', 'round');
  }
  svg.append(line);
  node.replaceChildren(svg);
  node.style.background = 'transparent';
  node.style.border = 'none';
}
