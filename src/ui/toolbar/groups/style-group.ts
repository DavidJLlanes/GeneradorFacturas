import { openStyleDialog } from '../../style-dialog/style-dialog';
import type { ButtonGroup } from '../button-spec';

export const styleGroup: ButtonGroup = {
  id: 'style',
  title: 'Estilo',
  buttons: [
    {
      id: 'style-open',
      label: 'Colores',
      title: 'Tema y paleta de colores del documento',
      run: (e) => openStyleDialog(e),
    },
  ],
};
