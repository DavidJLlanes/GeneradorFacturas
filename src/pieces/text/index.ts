import type { PieceDefinition } from '../types';
import { TEXT_STYLE_PROPS } from '../shared/text-style';
import { renderText } from './render';

const definition: PieceDefinition = {
  kind: 'text',
  name: 'Texto',
  defaultSize: { w: 60, h: 10 },
  defaultProps: { text: 'Texto', ...TEXT_STYLE_PROPS },
  props: [
    { key: 'text', label: 'Texto', kind: 'multiline' },
    { key: 'fontSize', label: 'Tamaño (pt)', kind: 'number', min: 4, max: 200, step: 0.5 },
    { key: 'color', label: 'Color', kind: 'color' },
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
  ],
  render: renderText,
};

export default definition;
