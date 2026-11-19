import { BAND_DEFAULTS, BAND_PROPS } from '../shared/band-props';
import { renderBand } from '../shared/band-render';
import type { PieceDefinition } from '../types';

const definition: PieceDefinition = {
  kind: 'header',
  name: 'Cabecera',
  defaultSize: { w: 180, h: 20 },
  defaultProps: { ...BAND_DEFAULTS, text: 'Cabecera' },
  props: BAND_PROPS,
  inlineProp: 'text',
  anchor: 'top',
  render: (node, input) => renderBand(node, input, 'bottom'),
};

export default definition;
