import type { PieceDefinition } from '../types';
import { renderImage } from './render';

const definition: PieceDefinition = {
  kind: 'image',
  name: 'Imagen',
  defaultSize: { w: 40, h: 25 },
  defaultProps: { src: '', field: '', fit: 'contain', opacity: 1 },
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
  ],
  render: renderImage,
};

export default definition;
