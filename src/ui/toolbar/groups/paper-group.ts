import { paperLabel } from '../../../paper/paper-label';
import { currencyOf } from '../../../data/currency';
import { openCurrencyDialog } from '../../currency-dialog/currency-dialog';
import { openPaperDialog } from '../../paper-dialog/paper-dialog';
import type { ButtonGroup } from '../button-spec';

export const paperGroup: ButtonGroup = {
  id: 'paper',
  title: 'Papel y moneda',
  buttons: [
    {
      id: 'paper-open',
      label: (e) => `Papel: ${paperLabel(e.doc().page)}`,
      title: 'Tamaño, orientación y márgenes del papel',
      run: (e) => openPaperDialog(e),
    },
    {
      id: 'currency-open',
      label: (e) => `Moneda: ${currencyOf(e.doc())}`,
      title: 'Moneda y formato de los importes',
      run: (e) => openCurrencyDialog(e),
    },
  ],
};
