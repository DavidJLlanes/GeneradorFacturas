import { paperLabel } from '../../../paper/paper-label';
import { openPaperDialog } from '../../paper-dialog/paper-dialog';
import type { ButtonGroup } from '../button-spec';

export const paperGroup: ButtonGroup = {
  id: 'paper',
  title: 'Papel',
  buttons: [
    {
      id: 'paper-open',
      label: (e) => `Papel: ${paperLabel(e.doc().page)}`,
      title: 'Tamaño, orientación y márgenes del papel',
      run: (e) => openPaperDialog(e),
    },
  ],
};
