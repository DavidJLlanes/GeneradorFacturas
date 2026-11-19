import {
  bringForward,
  bringToFront,
  sendBackward,
  sendToBack,
} from '../../../canvas/commands/order-commands';
import type { ButtonGroup } from '../button-spec';
import { hasSelection } from '../enabled-rules';

export const orderGroup: ButtonGroup = {
  id: 'order',
  title: 'Orden de capas',
  buttons: [
    {
      id: 'front',
      label: 'Al frente',
      title: 'Traer al frente (Ctrl+])',
      run: bringToFront,
      enabled: hasSelection,
    },
    {
      id: 'forward',
      label: 'Adelante',
      title: 'Subir una capa (])',
      run: bringForward,
      enabled: hasSelection,
    },
    {
      id: 'backward',
      label: 'Atrás',
      title: 'Bajar una capa ([)',
      run: sendBackward,
      enabled: hasSelection,
    },
    {
      id: 'back',
      label: 'Al fondo',
      title: 'Enviar al fondo (Ctrl+[)',
      run: sendToBack,
      enabled: hasSelection,
    },
  ],
};
