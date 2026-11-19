import type { PieceProps } from '../../core/document/types';
import { mmToPx } from '../../core/units/units';
import type { PropSpec } from '../types';
import { bool, num, str } from './props';

// Estilo de caja común a las piezas con fondo, borde, esquinas, sombra y margen interior.
// Todo es opcional: una pieza que no declare alguna de estas propiedades simplemente no la usa.

export const BOX_DEFAULTS = {
  filled: false,
  fill: '@soft',
  bordered: false,
  stroke: '@line',
  strokeWidth: 0.3,
  radius: 0,
  shadow: false,
  padding: 0,
} as const;

export const FILL_PROPS: readonly PropSpec[] = [
  { key: 'filled', label: 'Fondo', kind: 'toggle' },
  { key: 'fill', label: 'Color de fondo', kind: 'color' },
];

export const BORDER_PROPS: readonly PropSpec[] = [
  { key: 'bordered', label: 'Borde', kind: 'toggle' },
  { key: 'stroke', label: 'Color del borde', kind: 'color' },
  {
    key: 'strokeWidth',
    label: 'Grosor del borde (mm)',
    kind: 'number',
    min: 0,
    max: 20,
    step: 0.1,
  },
  {
    key: 'radius',
    label: 'Esquinas redondeadas (mm)',
    kind: 'number',
    min: 0,
    max: 200,
    step: 0.5,
  },
];

export const SHADOW_PROPS: readonly PropSpec[] = [
  { key: 'shadow', label: 'Sombra', kind: 'toggle' },
];

export const PADDING_PROPS: readonly PropSpec[] = [
  { key: 'padding', label: 'Margen interior (mm)', kind: 'number', min: 0, max: 50, step: 0.5 },
];

const SHADOW = `0 ${mmToPx(0.6)}px ${mmToPx(1.8)}px rgb(0 0 0 / 0.28)`;

// Aplica fondo, borde, esquinas, sombra y margen interior según las propiedades presentes.
// Con `ellipse` las esquinas son un óvalo completo.
export function applyBoxStyle(node: HTMLElement, props: PieceProps, ellipse = false): void {
  const s = node.style;
  s.boxSizing = 'border-box';
  s.background = bool(props, 'filled') ? str(props, 'fill') : 'transparent';
  const width = bool(props, 'bordered') ? mmToPx(num(props, 'strokeWidth')) : 0;
  s.border = width > 0 ? `${width}px solid ${str(props, 'stroke')}` : 'none';
  s.borderRadius = ellipse ? '50%' : `${mmToPx(num(props, 'radius'))}px`;
  s.boxShadow = bool(props, 'shadow') ? SHADOW : 'none';
  s.padding = `${mmToPx(num(props, 'padding'))}px`;
}
