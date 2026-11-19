import type { PieceDefinition } from '../types';
import { renderQr } from './render';

const definition: PieceDefinition = {
  kind: 'qr',
  name: 'Código QR',
  defaultSize: { w: 30, h: 30 },
  defaultProps: {
    content: 'https://',
    level: 'M',
    color: '#000000',
    opaque: true,
    background: '#ffffff',
    quietZone: 1,
  },
  props: [
    { key: 'content', label: 'Contenido (admite {{variables}})', kind: 'multiline' },
    {
      key: 'level',
      label: 'Corrección de errores',
      kind: 'select',
      options: [
        { value: 'L', label: 'Baja (7 %)' },
        { value: 'M', label: 'Media (15 %)' },
        { value: 'Q', label: 'Alta (25 %)' },
        { value: 'H', label: 'Máxima (30 %)' },
      ],
    },
    { key: 'color', label: 'Color', kind: 'color' },
    { key: 'opaque', label: 'Fondo', kind: 'toggle' },
    { key: 'background', label: 'Color de fondo', kind: 'color' },
    { key: 'quietZone', label: 'Margen (módulos)', kind: 'number', min: 0, max: 8, step: 1 },
  ],
  inlineProp: 'content',
  render: renderQr,
};

export default definition;
