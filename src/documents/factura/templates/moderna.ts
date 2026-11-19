import { createPage } from '../../../core/document/page';
import type { DocumentTemplate } from '../../../core/document-type/types';
import {
  basesBlock,
  clientDetails,
  clientLabel,
  clientName,
  dates,
  footerBand,
  issuerDetails,
  issuerName,
  linesTable,
  logo,
  number,
  paymentBlock,
  piece,
  title,
  totalsBlock,
  type Theme,
} from './parts';

const theme: Theme = { accent: '#0f766e', ink: '#0f172a', muted: '#475569', soft: '#ecfdf5' };
const WHITE = '#ffffff';

// Moderna: banda de color a todo el ancho arriba, con el título y el número en blanco.
export const moderna: DocumentTemplate = {
  id: 'moderna',
  name: 'Moderna',
  document: {
    page: createPage(210, 297),
    elements: [
      piece('banda', 'Banda superior', 'shape', [0, 0, 210, 40], {
        fill: theme.accent,
        bordered: false,
      }),
      title([10, 9, 110, 13], WHITE),
      number([10, 24, 110, 7], WHITE),
      logo([150, 7, 50, 26]),
      issuerName([10, 48, 90, 7], theme),
      issuerDetails([10, 55, 90, 16], theme),
      dates([105, 48, 95, 14], theme.muted),
      clientLabel([10, 76, 90, 5], theme),
      clientName([10, 81, 110, 7], theme),
      clientDetails([10, 88, 110, 16], theme),
      linesTable([10, 108, 190, 106], theme),
      basesBlock([10, 220, 80, 28], theme),
      totalsBlock([125, 220, 75, 39], theme),
      paymentBlock([10, 252, 110, 22], theme),
      footerBand([10, 277, 190, 10], theme),
    ],
  },
};
