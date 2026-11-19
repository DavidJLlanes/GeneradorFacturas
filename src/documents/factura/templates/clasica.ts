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
  withFont,
} from './parts';

const theme: Theme = { accent: '@primary', ink: '@text', muted: '@muted', soft: '@soft' };

// Clásica: sobria, con el emisor a la izquierda y los datos de la factura a la derecha.
export const clasica: DocumentTemplate = {
  id: 'clasica',
  name: 'Clásica',
  document: {
    page: createPage(210, 297),
    elements: withFont(
      [
        logo([10, 10, 45, 22]),
        title([105, 10, 95, 13], theme.accent),
        number([105, 24, 95, 7], theme.ink),
        dates([105, 33, 95, 14], theme.muted),
        issuerName([10, 36, 90, 7], theme),
        issuerDetails([10, 43, 90, 16], theme),
        piece('separador', 'Separador', 'line', [10, 63, 190, 1], { color: theme.accent }),
        clientLabel([10, 68, 90, 5], theme),
        clientName([10, 73, 110, 7], theme),
        clientDetails([10, 80, 110, 16], theme),
        linesTable([10, 102, 190, 112], theme),
        basesBlock([10, 220, 80, 28], theme),
        totalsBlock([125, 220, 75, 39], theme),
        paymentBlock([10, 252, 110, 22], theme),
        footerBand([10, 277, 190, 10], theme),
      ],
      'inter',
    ),
  },
};
