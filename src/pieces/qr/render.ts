import { bool, num, str } from '../shared/props';
import type { PieceRenderInput } from '../types';
import { qrMatrix, type QrLevel } from './encode';

const SVG_NS = 'http://www.w3.org/2000/svg';
const LEVELS: readonly string[] = ['L', 'M', 'Q', 'H'];

export function renderQr(node: HTMLElement, { props, resolve }: PieceRenderInput): void {
  node.style.border = 'none';
  node.style.background = 'transparent';
  const level = (LEVELS.includes(str(props, 'level')) ? str(props, 'level') : 'M') as QrLevel;
  const matrix = qrMatrix(resolve(str(props, 'content')), level);
  if (!matrix) {
    node.style.display = 'flex';
    node.style.alignItems = 'center';
    node.style.justifyContent = 'center';
    node.style.border = '1px dashed #8a919c';
    node.style.color = '#8a919c';
    node.style.fontSize = '12px';
    node.textContent = 'QR';
    return;
  }

  const quiet = Math.max(0, Math.round(num(props, 'quietZone')));
  const size = matrix.length + quiet * 2;
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.style.display = 'block';

  if (bool(props, 'opaque')) {
    const bg = document.createElementNS(SVG_NS, 'rect');
    bg.setAttribute('width', String(size));
    bg.setAttribute('height', String(size));
    bg.setAttribute('fill', str(props, 'background'));
    svg.append(bg);
  }
  // Un solo trazo para todos los módulos oscuros: ligero y sin costuras entre cuadros.
  let path = '';
  matrix.forEach((row, r) =>
    row.forEach((dark, c) => {
      if (dark) path += `M${c + quiet} ${r + quiet}h1v1h-1z`;
    }),
  );
  const modules = document.createElementNS(SVG_NS, 'path');
  modules.setAttribute('d', path);
  modules.setAttribute('fill', str(props, 'color'));
  svg.append(modules);
  node.style.display = 'block';
  node.replaceChildren(svg);
}
