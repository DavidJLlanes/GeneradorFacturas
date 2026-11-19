import type { PieceDefinition } from '../types';
import { renderShape } from './render';

const definition: PieceDefinition = {
  kind: 'shape',
  name: 'Forma',
  defaultSize: { w: 50, h: 30 },
  defaultProps: {
    shape: 'rect',
    filled: true,
    fill: '#e5e7eb',
    bordered: true,
    stroke: '#374151',
    strokeWidth: 0.3,
    radius: 0,
  },
  props: [
    {
      key: 'shape',
      label: 'Forma',
      kind: 'select',
      options: [
        { value: 'rect', label: 'Rectángulo' },
        { value: 'ellipse', label: 'Elipse' },
      ],
    },
    { key: 'filled', label: 'Relleno', kind: 'toggle' },
    { key: 'fill', label: 'Color de relleno', kind: 'color' },
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
  ],
  render: renderShape,
};

export default definition;
