import { clearData, loadSampleData, toggleFillMode } from '../../../canvas/commands/data-commands';
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
    {
      id: 'sample-data',
      label: 'Datos de ejemplo',
      title: 'Rellenar con datos de muestra para ver el diseño',
      run: loadSampleData,
      enabled: (e) => e.ui.get().sample !== null,
    },
    {
      id: 'clear-data',
      label: 'Vaciar datos',
      title: 'Borrar todos los datos del documento (el diseño no cambia)',
      run: clearData,
      enabled: (e) => Object.keys(e.ui.get().data).length > 0,
    },
  ],
};
