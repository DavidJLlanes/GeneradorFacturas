import { openBatchDialog } from '../../batch-dialog/batch-dialog';
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
    {
      id: 'batch-open',
      label: 'Lote',
      title: 'Generar muchos documentos desde un CSV: un PDF por fila, en un ZIP',
      run: (e) => openBatchDialog(e),
    },
  ],
};
