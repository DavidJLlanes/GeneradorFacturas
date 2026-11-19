import { applyBoxStyle } from '../shared/box-style';
import { str } from '../shared/props';
import type { PieceRenderInput } from '../types';

export function renderShape(node: HTMLElement, { props }: PieceRenderInput): void {
  applyBoxStyle(node, props, str(props, 'shape') === 'ellipse');
  node.style.padding = '0';
  node.replaceChildren();
}
