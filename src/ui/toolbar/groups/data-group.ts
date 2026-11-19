import { toggleFillMode } from '../../../canvas/commands/data-commands';
import type { ButtonGroup } from '../button-spec';

export const dataGroup: ButtonGroup = {
  id: 'data',
  title: 'Datos',
  buttons: [
    {
      id: 'fill-mode',
      label: 'Con datos',
      title: 'Ver el documento relleno con los datos, o la plantilla limpia',
      run: toggleFillMode,
      pressed: (e) => e.ui.get().fillMode,
    },
  ],
};
