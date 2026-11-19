import { createPage } from '../../../core/document/page';
import type { DocumentTemplate } from '../../../core/document-type/types';
import {
  linesTable,
  numberBlock,
  partyBlock,
  separator,
  totalsBlock,
} from '../../../core/template-kit/blocks';
import { DEFAULT_THEME as t, text, withFont } from '../../../core/template-kit/pieces';
import { labels } from '../labels.es';

const [head, name, details] = partyBlock(
  'emisor',
  [4, 4, 72],
  {
    name: '{{emisor.nombre}}',
    details: [`${labels['nif']} {{emisor.nif}}`, '{{emisor.direccion}}', '{{emisor.telefono}}'],
    detailsH: 14,
  },
  t,
);
const table = linesTable([4, 42, 72, 60], t, 3);

// Clásica: comercio centrado, tabla compacta, total destacado y mensaje final (80 mm de ancho).
export const clasica: DocumentTemplate = {
  id: 'clasica',
  name: 'Clásica',
  document: {
    page: createPage(80, 150, 4),
    elements: withFont(
      [
        ...[head, name, details].flatMap((el) =>
          el ? [{ ...el, props: { ...el.props, align: 'center' } }] : [],
        ),
        separator([4, 27, 72, 1], t),
        {
          ...numberBlock([4, 29, 72, 5], `${labels['numero']} {{numeroTicket}}`, t, false),
          props: {
            text: `${labels['numero']} {{numeroTicket}}`,
            fontSize: 9,
            align: 'left',
            color: t.ink,
          },
        },
        text('fecha', 'Fecha y hora', [4, 34, 72, 5], {
          text: '{{fecha}}  {{hora}}',
          fontSize: 8,
          color: t.muted,
        }),
        { ...table, props: { ...table.props, fontSize: 7.5, rowHeight: 5, cellPadding: 0.8 } },
        totalsBlock(
          [30, 106, 46, 11],
          [`${labels['total']} | {{total}}`, `${labels['ivaIncluido']} | {{ivaIncluido}}`],
          t,
        ),
        text('pago', 'Forma de pago', [4, 120, 72, 5], {
          text: `${labels['formaPago']}: {{formaPago}}`,
          fontSize: 8,
          color: t.muted,
        }),
        text('mensaje', 'Mensaje final', [4, 128, 72, 14], {
          text: '{{mensaje}}',
          fontSize: 9,
          align: 'center',
          color: t.ink,
        }),
      ],
      'inter',
    ),
  },
};
