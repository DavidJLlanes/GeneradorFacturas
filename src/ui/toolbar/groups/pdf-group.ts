import { openPdfDialog } from '../../pdf-dialog/pdf-dialog';
import type { ButtonGroup } from '../button-spec';

export const pdfGroup: ButtonGroup = {
  id: 'pdf',
  title: 'Exportar',
  buttons: [
    {
      id: 'pdf-open',
      label: 'PDF',
      title: 'Exportar a PDF (documento relleno o modelo limpio)',
      run: (e) => openPdfDialog(e),
    },
  ],
};
