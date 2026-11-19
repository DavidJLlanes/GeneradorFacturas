import { openFilesDialog } from '../../files-dialog/files-dialog';
import type { ButtonGroup } from '../button-spec';

export const fileGroup: ButtonGroup = {
  id: 'file',
  title: 'Archivo',
  buttons: [
    {
      id: 'file-open',
      label: 'Archivo',
      title: 'Guardar y abrir diseños y datos, plantillas propias y almacenamiento',
      run: (e) => openFilesDialog(e),
    },
  ],
};
