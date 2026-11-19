import type { PieceRenderInput } from '../types';
import { str } from '../shared/props';
import { applyTextStyle } from '../shared/text-style';

export function renderText(node: HTMLElement, { props, resolve }: PieceRenderInput): void {
  applyTextStyle(node, props);
  node.textContent = resolve(str(props, 'text'));
}
