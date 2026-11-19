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
  signatureBlock,
  titleBlock,
  totalsBlock,
} from '../../../core/template-kit/blocks';
import { DEFAULT_THEME as t, withFont } from '../../../core/template-kit/pieces';
import { labels } from '../labels.es';

// Clásica: comprador a la izquierda, proveedor y lugar de entrega, tabla, totales y autorización.
export const clasica: DocumentTemplate = {
  id: 'clasica',
  name: 'Clásica',
  document: {
    page: createPage(210, 297),
    elements: withFont(
      [
        logoBlock([10, 10, 45, 22]),
        titleBlock([105, 10, 95, 13], labels['titulo'] ?? '', t),
        numberBlock([105, 24, 95, 7], 'Nº {{numeroPedido}}', t),
        metaBlock(
          [105, 33, 95, 10],
          [`${labels['fecha']}: {{fecha}}`, `${labels['entrega']}: {{fechaEntrega}}`],
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
          'proveedor',
          [10, 68, 95],
          {
            label: labels['proveedor'],
            name: '{{proveedor.nombre}}',
            details: [
              `${labels['nif']} {{proveedor.nif}}`,
              '{{proveedor.direccion}}',
              '{{proveedor.email}}',
            ],
            detailsH: 16,
          },
          t,
        ),
        noteBlock(
          'entrega',
          'Lugar de entrega',
          [112, 68, 88, 28],
          ['{{lugarEntrega}}'],
          t,
          labels['lugarEntrega'],
        ),
        linesTable([10, 102, 190, 100], t, 10),
        noteBlock(
          'condiciones',
          'Condiciones',
          [10, 208, 110, 30],
          ['{{condiciones}}'],
          t,
          labels['condiciones'],
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
        ...signatureBlock('autorizado', [10, 248, 90, 24], labels['autorizado'] ?? '', t),
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
