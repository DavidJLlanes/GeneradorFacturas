import type { PieceDefinition } from '../types';
import {
  BORDER_PROPS,
  BOX_DEFAULTS,
  FILL_PROPS,
  PADDING_PROPS,
  SHADOW_PROPS,
} from '../shared/box-style';
import { TEXT_STYLE_PROPS } from '../shared/text-style';
import { renderText } from './render';

const definition: PieceDefinition = {
  kind: 'text',
  name: 'Texto',
  defaultSize: { w: 60, h: 10 },
  defaultProps: { text: 'Texto', ...TEXT_STYLE_PROPS, ...BOX_DEFAULTS },
  props: [
    { key: 'text', label: 'Texto', kind: 'multiline' },
    { key: 'fontSize', label: 'Tamaño (pt)', kind: 'number', min: 4, max: 200, step: 0.5 },
    { key: 'color', label: 'Color', kind: 'color' },
    { key: 'lineHeight', label: 'Interlineado', kind: 'number', min: 0.8, max: 3, step: 0.05 },
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
    ...PADDING_PROPS,
    ...FILL_PROPS,
    ...BORDER_PROPS,
    ...SHADOW_PROPS,
  ],
  inlineProp: 'text',
  render: renderText,
};

export default definition;
