import { BAND_DEFAULTS, BAND_PROPS } from '../shared/band-props';
import { renderBand } from '../shared/band-render';
import type { PieceDefinition } from '../types';

const definition: PieceDefinition = {
  kind: 'footer',
  name: 'Pie de página',
  defaultSize: { w: 180, h: 15 },
  defaultProps: { ...BAND_DEFAULTS, text: 'Pie de página', align: 'center', fontSize: 9 },
  props: BAND_PROPS,
  inlineProp: 'text',
  anchor: 'bottom',
  render: (node, input) => renderBand(node, input, 'top'),
};

export default definition;
