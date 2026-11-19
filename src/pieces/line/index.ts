import type { PieceDefinition } from '../types';
import { renderLine } from './render';

const definition: PieceDefinition = {
  kind: 'line',
  name: 'Línea',
  defaultSize: { w: 80, h: 2 },
  defaultProps: { orientation: 'horizontal', color: '@primary', thickness: 0.4, style: 'solid' },
  props: [
    {
      key: 'orientation',
      label: 'Dirección',
      kind: 'select',
      options: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
        { value: 'diagonal-down', label: 'Diagonal \\' },
        { value: 'diagonal-up', label: 'Diagonal /' },
      ],
    },
    { key: 'color', label: 'Color', kind: 'color' },
    { key: 'thickness', label: 'Grosor (mm)', kind: 'number', min: 0.1, max: 20, step: 0.1 },
    {
      key: 'style',
      label: 'Estilo',
      kind: 'select',
      options: [
        { value: 'solid', label: 'Continua' },
        { value: 'dashed', label: 'Guiones' },
        { value: 'dotted', label: 'Puntos' },
      ],
    },
  ],
  render: renderLine,
};

export default definition;
