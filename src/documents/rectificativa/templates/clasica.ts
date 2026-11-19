import { createPage } from '../../../core/document/page';
import type { DocumentTemplate } from '../../../core/document-type/types';
import {
  footerBlock,
  linesTable,
  logoBlock,
  metaBlock,
  noteBlock,
  numberBlock,
  partyBlock,
  separator,
  titleBlock,
  totalsBlock,
} from '../../../core/template-kit/blocks';
import { DEFAULT_THEME as t, withFont } from '../../../core/template-kit/pieces';
import { labels } from '../labels.es';

// Clásica: como una factura, con la referencia a la factura rectificada y el motivo.
export const clasica: DocumentTemplate = {
  id: 'clasica',
  name: 'Clásica',
  document: {
    page: createPage(210, 297),
    elements: withFont(
      [
        logoBlock([10, 10, 45, 22]),
        titleBlock([75, 10, 125, 11], 'FACTURA RECTIFICATIVA', t, 20),
        numberBlock([105, 24, 95, 7], 'Nº {{numeroFactura}}', t),
        metaBlock(
          [105, 33, 95, 14],
          [
            `${labels['fecha']}: {{fecha}}`,
            `${labels['rectifica']} {{facturaRectificada}}`,
            `${labels['de']} {{fechaRectificada}}`,
          ],
          t,
        ),
        ...partyBlock(
          'emisor',
          [10, 36, 90],
          {
            name: '{{emisor.nombre}}',
            details: [
              `${labels['nif']} {{emisor.nif}}`,
              '{{emisor.direccion}}',
              '{{emisor.email}} · {{emisor.telefono}}',
            ],
            detailsH: 16,
          },
          t,
        ),
        separator([10, 63, 190, 1], t),
        ...partyBlock(
          'cliente',
          [10, 68, 110],
          {
            label: labels['facturarA'],
            name: '{{cliente.nombre}}',
            details: [
              `${labels['nif']} {{cliente.nif}}`,
              '{{cliente.direccion}}',
              '{{cliente.email}}',
            ],
            detailsH: 16,
          },
          t,
        ),
        linesTable([10, 102, 190, 100], t, 10),
        noteBlock(
          'motivo',
          'Motivo y notas',
          [10, 208, 110, 30],
          ['{{motivo}}', '{{notas}}'],
          t,
          labels['motivo'],
        ),
        totalsBlock(
          [125, 208, 75, 28],
          [
            `${labels['baseImponible']} | {{baseTotal}}`,
            `${labels['iva']} 21 % | {{iva21}}`,
            `${labels['iva']} 10 % | {{iva10}}`,
            `${labels['iva']} 4 % | {{iva4}}`,
            `${labels['total']} | {{total}}`,
          ],
          t,
        ),
        footerBlock(
          [10, 277, 190, 10],
          `{{emisor.nombre}} · ${labels['nif']} {{emisor.nif}} · Página {{pagina}} de {{paginas}}`,
          t,
        ),
      ],
      'inter',
    ),
  },
};
