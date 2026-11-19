import type { PieceDefinition } from '../types';
import { BORDER_PROPS, SHADOW_PROPS } from '../shared/box-style';
import { renderImage } from './render';

const definition: PieceDefinition = {
  kind: 'image',
  name: 'Imagen',
  defaultSize: { w: 40, h: 25 },
  defaultProps: {
    src: '',
    field: '',
    fit: 'contain',
    opacity: 1,
    bordered: false,
    stroke: '@line',
    strokeWidth: 0.3,
    radius: 0,
    shadow: false,
  },
  props: [
    { key: 'src', label: 'Imagen', kind: 'image' },
    {
      key: 'fit',
      label: 'Ajuste',
      kind: 'select',
      options: [
        { value: 'contain', label: 'Caber entera' },
        { value: 'cover', label: 'Rellenar y recortar' },
        { value: 'fill', label: 'Estirar' },
      ],
    },
    { key: 'opacity', label: 'Opacidad (0–1)', kind: 'number', min: 0, max: 1, step: 0.1 },
    { key: 'field', label: 'Campo de datos (opcional)', kind: 'text' },
    ...BORDER_PROPS,
    ...SHADOW_PROPS,
  ],
  render: renderImage,
};

export default definition;
