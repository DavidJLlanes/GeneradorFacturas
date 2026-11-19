import { mmToPx } from '../../core/units/units';
import { bool, num, str } from '../shared/props';
import type { PieceRenderInput } from '../types';

export function renderShape(node: HTMLElement, { props }: PieceRenderInput): void {
  const s = node.style;
  s.boxSizing = 'border-box';
  s.background = bool(props, 'filled') ? str(props, 'fill') : 'transparent';
  const width = bool(props, 'bordered') ? mmToPx(num(props, 'strokeWidth')) : 0;
  s.border = width > 0 ? `${width}px solid ${str(props, 'stroke')}` : 'none';
  s.borderRadius = str(props, 'shape') === 'ellipse' ? '50%' : `${mmToPx(num(props, 'radius'))}px`;
  node.replaceChildren();
}
