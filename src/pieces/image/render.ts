import { isImageDataUrl } from '../../images/image-limits';
import { applyBoxStyle } from '../shared/box-style';
import { bool, str } from '../shared/props';
import type { PieceRenderInput } from '../types';

// Si la pieza está ligada a un campo de datos de imagen y hay dato, se usa; si no, la imagen propia.
function sourceOf({ props, resolve }: PieceRenderInput): string {
  const field = str(props, 'field').trim();
  if (field) {
    const bound = resolve(`{{${field}}}`);
    if (isImageDataUrl(bound)) return bound;
  }
  const own = str(props, 'src');
  return isImageDataUrl(own) ? own : '';
}

export function renderImage(node: HTMLElement, input: PieceRenderInput): void {
  const src = sourceOf(input);
  applyBoxStyle(node, input.props);
  node.style.overflow = 'hidden';
  node.style.opacity = String(Math.min(1, Math.max(0, Number(input.props['opacity'] ?? 1))));

  if (!src) {
    node.style.display = 'flex';
    node.style.alignItems = 'center';
    node.style.justifyContent = 'center';
    node.style.color = '#8a919c';
    node.style.fontSize = '12px';
    if (!bool(input.props, 'bordered')) node.style.border = '1px dashed #8a919c';
    node.textContent = 'Imagen';
    return;
  }
  const img = document.createElement('img');
  img.src = src;
  img.alt = '';
  img.draggable = false;
  img.style.cssText = `width:100%;height:100%;display:block;pointer-events:none;object-fit:${str(input.props, 'fit')}`;
  node.style.display = 'block';
  node.replaceChildren(img);
}
