import { mmToPx } from '../../core/units/units';
import type { PieceRenderInput } from '../types';
import { bool, num, str } from './props';
import { applyTextStyle } from './text-style';

// Banda de cabecera o pie: fondo opcional, texto y una línea en el borde que da al contenido.
export function renderBand(
  node: HTMLElement,
  { props, resolve }: PieceRenderInput,
  edge: 'top' | 'bottom',
): void {
  applyTextStyle(node, props);
  const s = node.style;
  s.boxSizing = 'border-box';
  s.padding = `0 ${mmToPx(num(props, 'padding'))}px`;
  s.background = bool(props, 'filled') ? str(props, 'fill') : 'transparent';
  s.border = 'none';
  const line = bool(props, 'rule') ? `${mmToPx(0.3)}px solid ${str(props, 'ruleColor')}` : 'none';
  if (edge === 'bottom') s.borderBottom = line;
  else s.borderTop = line;
  node.textContent = resolve(str(props, 'text'));
}
