import {
  zoomIn,
  zoomOut,
  zoomTo100,
  zoomToFit,
  zoomToSelection,
} from '../../../canvas/commands/view-commands';
import type { ButtonGroup } from '../button-spec';
import { hasSelection } from '../enabled-rules';

export const viewGroup: ButtonGroup = {
  id: 'view',
  title: 'Zoom',
  buttons: [
    { id: 'zoom-out', label: '−', title: 'Alejar (-)', run: zoomOut },
    {
      id: 'zoom-100',
      label: (e) => `${Math.round(e.ui.get().viewport.zoom * 100)} %`,
      title: 'Zoom al 100 % (Shift+0)',
      run: zoomTo100,
    },
    { id: 'zoom-in', label: '+', title: 'Acercar (+)', run: zoomIn },
    { id: 'zoom-fit', label: 'Ajustar', title: 'Ver toda la página (Shift+1)', run: zoomToFit },
    {
      id: 'zoom-selection',
      label: 'Detalle',
      title: 'Acercar a la selección (Shift+2)',
      run: zoomToSelection,
      enabled: hasSelection,
    },
  ],
};
