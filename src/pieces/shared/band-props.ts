import type { PropSpec } from '../types';
import { TEXT_STYLE_PROPS } from './text-style';

export const BAND_DEFAULTS = {
  ...TEXT_STYLE_PROPS,
  valign: 'middle',
  padding: 3,
  filled: false,
  fill: '@soft',
  rule: true,
  ruleColor: '@primary',
} as const;

export const BAND_PROPS: readonly PropSpec[] = [
  { key: 'text', label: 'Texto', kind: 'multiline' },
  { key: 'fontSize', label: 'Tamaño (pt)', kind: 'number', min: 4, max: 200, step: 0.5 },
  { key: 'color', label: 'Color del texto', kind: 'color' },
  { key: 'bold', label: 'Negrita', kind: 'toggle' },
  { key: 'italic', label: 'Cursiva', kind: 'toggle' },
  {
    key: 'align',
    label: 'Alineación',
    kind: 'select',
    options: [
      { value: 'left', label: 'Izquierda' },
      { value: 'center', label: 'Centro' },
      { value: 'right', label: 'Derecha' },
    ],
  },
  {
    key: 'valign',
    label: 'Vertical',
    kind: 'select',
    options: [
      { value: 'top', label: 'Arriba' },
      { value: 'middle', label: 'Centro' },
      { value: 'bottom', label: 'Abajo' },
    ],
  },
  { key: 'lineHeight', label: 'Interlineado', kind: 'number', min: 0.8, max: 3, step: 0.05 },
  { key: 'padding', label: 'Margen lateral (mm)', kind: 'number', min: 0, max: 50, step: 0.5 },
  { key: 'filled', label: 'Fondo', kind: 'toggle' },
  { key: 'fill', label: 'Color de fondo', kind: 'color' },
  { key: 'rule', label: 'Línea', kind: 'toggle' },
  { key: 'ruleColor', label: 'Color de la línea', kind: 'color' },
];
