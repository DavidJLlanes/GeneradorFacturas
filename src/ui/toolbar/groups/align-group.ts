import type { AlignMode } from '../../../canvas/align/align';
import type { DistributeAxis } from '../../../canvas/align/distribute';
import { alignSelection, distributeSelection } from '../../../canvas/commands/align-commands';
import type { ButtonGroup, ButtonSpec } from '../button-spec';
import { canDistribute, canTransform } from '../enabled-rules';

const align = (id: AlignMode, label: string, title: string): ButtonSpec => ({
  id: `align-${id}`,
  label,
  title: `${title} (con un solo elemento, respecto a la página)`,
  run: (e) => alignSelection(e, id),
  enabled: canTransform,
});

const distribute = (axis: DistributeAxis, label: string, title: string): ButtonSpec => ({
  id: `distribute-${axis}`,
  label,
  title: `${title} (mínimo 3 elementos)`,
  run: (e) => distributeSelection(e, axis),
  enabled: canDistribute,
});

export const alignGroup: ButtonGroup = {
  id: 'align',
  title: 'Alinear y distribuir',
  buttons: [
    align('left', 'Izq.', 'Alinear a la izquierda'),
    align('hcenter', 'Centro H', 'Centrar horizontalmente'),
    align('right', 'Der.', 'Alinear a la derecha'),
    align('top', 'Arriba', 'Alinear arriba'),
    align('vmiddle', 'Centro V', 'Centrar verticalmente'),
    align('bottom', 'Abajo', 'Alinear abajo'),
    distribute('horizontal', 'Repartir H', 'Repartir en horizontal'),
    distribute('vertical', 'Repartir V', 'Repartir en vertical'),
  ],
};
