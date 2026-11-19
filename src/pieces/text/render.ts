import type { PieceRenderInput } from '../types';
import { str } from '../shared/props';
import { applyBoxStyle } from '../shared/box-style';
import { applyTextStyle } from '../shared/text-style';

export function renderText(node: HTMLElement, { props, resolve }: PieceRenderInput): void {
  applyTextStyle(node, props);
  applyBoxStyle(node, props);
  node.textContent = resolve(str(props, 'text'));
}
