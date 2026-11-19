import { mmToPx } from '../../core/units/units';
import { bool, num, str } from '../shared/props';
import { applyFont } from '../shared/text-style';
import type { PieceRenderInput } from '../types';

const PX_PER_PT = 96 / 72;

// Bloque de totales: una fila por línea del texto, con formato `Etiqueta | {{variable}}`.
// La última fila puede destacarse (negrita, fondo y línea encima).
export function renderTotals(
  node: HTMLElement,
  { props, resolve, fillMode }: PieceRenderInput,
): void {
  const hide = bool(props, 'hideUnresolved') && fillMode;
  const lines = str(props, 'rows')
    .split('\n')
    .filter((l) => l.trim() !== '')
    // Con datos y la opción activa, se omiten las filas cuyo valor no se pudo calcular.
    .filter((l) => !hide || !resolve(l.slice(l.indexOf('|') + 1)).includes('{{'));
  node.style.border = 'none';
  node.style.background = 'transparent';
  node.style.display = 'grid';
  node.style.gridTemplateColumns = '1fr auto';
  node.style.gridAutoRows = `${mmToPx(Math.max(num(props, 'rowHeight'), 2))}px`;
  node.style.alignContent = 'start';
  applyFont(node, str(props, 'fontFamily'));
  node.style.fontSize = `${num(props, 'fontSize') * PX_PER_PT}px`;
  node.style.color = str(props, 'color');
  node.style.overflow = 'hidden';

  const cells: HTMLElement[] = [];
  lines.forEach((text, i) => {
    const cut = text.indexOf('|');
    const label = cut === -1 ? text : text.slice(0, cut);
    const value = cut === -1 ? '' : text.slice(cut + 1);
    const last = i === lines.length - 1 && bool(props, 'highlightLast');
    for (const [content, right] of [
      [label.trim(), false],
      [resolve(value.trim()), true],
    ] as const) {
      const div = document.createElement('div');
      div.textContent = content;
      const s = div.style;
      s.display = 'flex';
      s.alignItems = 'center';
      s.justifyContent = right ? 'flex-end' : 'flex-start';
      s.padding = `0 ${mmToPx(2)}px`;
      s.whiteSpace = 'nowrap';
      s.minWidth = '0';
      if (right) s.gap = '0';
      if (last) {
        s.fontWeight = '700';
        s.background = str(props, 'highlightFill');
        s.borderTop = `${mmToPx(0.3)}px solid ${str(props, 'ruleColor')}`;
      }
      cells.push(div);
    }
  });
  node.replaceChildren(...cells);
}
