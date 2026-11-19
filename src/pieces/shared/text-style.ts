import type { PieceProps } from '../../core/document/types';
import { bool, num, str } from './props';

const PX_PER_PT = 96 / 72;

const JUSTIFY: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' };
const ALIGN_ITEMS: Record<string, string> = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
};

// Aplica a un nodo el estilo de texto común (tamaño en pt, color, negrita, cursiva, alineación).
// Espera las propiedades fontSize, color, bold, italic, align y valign.
export function applyTextStyle(node: HTMLElement, props: PieceProps): void {
  const s = node.style;
  s.display = 'flex';
  s.fontSize = `${num(props, 'fontSize') * PX_PER_PT}px`;
  s.color = str(props, 'color');
  s.fontWeight = bool(props, 'bold') ? '700' : '400';
  s.fontStyle = bool(props, 'italic') ? 'italic' : 'normal';
  s.textAlign = str(props, 'align');
  s.justifyContent = JUSTIFY[str(props, 'align')] ?? 'flex-start';
  s.alignItems = ALIGN_ITEMS[str(props, 'valign')] ?? 'flex-start';
  s.whiteSpace = 'pre-wrap';
  s.overflow = 'hidden';
  s.lineHeight = String(num(props, 'lineHeight') || 1.25);
}

// Propiedades de texto compartidas por las piezas que muestran texto.
export const TEXT_STYLE_PROPS = {
  fontSize: 11,
  color: '@text',
  bold: false,
  italic: false,
  align: 'left',
  valign: 'top',
  lineHeight: 1.25,
} as const;
