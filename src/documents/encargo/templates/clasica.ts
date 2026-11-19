import { createPage } from '../../../core/document/page';
import type { DocumentTemplate } from '../../../core/document-type/types';
import {
  captionBlock,
  footerBlock,
  logoBlock,
  noteBlock,
  numberBlock,
  partyBlock,
  separator,
  signatureBlock,
  titleBlock,
  totalsBlock,
  metaBlock,
} from '../../../core/template-kit/blocks';
import { DEFAULT_THEME as t, text, withFont } from '../../../core/template-kit/pieces';
import { labels } from '../labels.es';

// Clásica: partes arriba, objeto y alcance en texto libre, importes destacados y firma de ambas partes.
export const clasica: DocumentTemplate = {
  id: 'clasica',
  name: 'Clásica',
  document: {
    page: createPage(210, 297),
    elements: withFont(
      [
        logoBlock([10, 10, 45, 22]),
        titleBlock([75, 10, 125, 11], labels['titulo'] ?? '', t, 20),
        numberBlock([105, 24, 95, 7], 'Nº {{numeroEncargo}}', t),
        metaBlock([105, 33, 95, 6], [`${labels['fecha']}: {{fecha}}`], t),
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
            label: labels['cliente'],
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
        captionBlock(
          'objeto-rotulo',
          'Rótulo objeto',
          [10, 102, 190, 5],
          labels['objeto'] ?? '',
          t,
        ),
        text('objeto', 'Objeto del encargo', [10, 108, 190, 20], {
          text: '{{objeto}}',
          fontSize: 10.5,
          color: t.ink,
        }),
        captionBlock(
          'alcance-rotulo',
          'Rótulo alcance',
          [10, 132, 190, 5],
          labels['alcance'] ?? '',
          t,
        ),
        text('alcance', 'Alcance y entregables', [10, 138, 190, 40], {
          text: '{{alcance}}',
          fontSize: 10,
          color: t.ink,
        }),
        text('plazo', 'Plazo', [10, 182, 190, 6], {
          text: `${labels['plazo']}: {{plazo}}`,
          fontSize: 10,
          bold: true,
          color: t.ink,
        }),
        noteBlock(
          'condiciones',
          'Condiciones',
          [10, 196, 110, 30],
          ['{{condiciones}}'],
          t,
          labels['condiciones'],
        ),
        totalsBlock(
          [125, 196, 75, 17],
          [
            `${labels['honorarios']} | {{honorarios}}`,
            `${labels['provision']} | {{provision}}`,
            `${labels['pendiente']} | {{pendiente}}`,
          ],
          t,
        ),
        ...signatureBlock('profesional', [10, 248, 90, 24], labels['firmaProfesional'] ?? '', t),
        ...signatureBlock('cliente-firma', [110, 248, 90, 24], labels['firmaCliente'] ?? '', t),
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
