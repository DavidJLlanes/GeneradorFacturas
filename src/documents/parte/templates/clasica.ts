import { createPage } from '../../../core/document/page';
import type { DocumentTemplate } from '../../../core/document-type/types';
import {
  captionBlock,
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
} from '../../../core/template-kit/blocks';
import { DEFAULT_THEME as t, text, withFont } from '../../../core/template-kit/pieces';
import { labels } from '../labels.es';

// Clásica: cabecera con datos del parte, cliente, trabajo realizado, materiales y dos firmas.
export const clasica: DocumentTemplate = {
  id: 'clasica',
  name: 'Clásica',
  document: {
    page: createPage(210, 297),
    elements: withFont(
      [
        logoBlock([10, 10, 45, 22]),
        titleBlock([75, 10, 125, 11], labels['titulo'] ?? '', t, 20),
        numberBlock([105, 24, 95, 7], 'Nº {{numeroParte}}', t),
        metaBlock(
          [105, 33, 95, 14],
          [
            `${labels['fecha']}: {{fecha}}`,
            `${labels['horario']}: {{horaInicio}} – {{horaFin}}`,
            `${labels['duracion']}: {{duracion}}`,
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
            label: labels['cliente'],
            name: '{{cliente.nombre}}',
            details: [`${labels['nif']} {{cliente.nif}}`, '{{cliente.direccion}}'],
            detailsH: 12,
          },
          t,
        ),
        text('tecnico', 'Técnico', [125, 73, 75, 7], {
          text: `${labels['tecnico']}: {{tecnico}}`,
          fontSize: 10,
          align: 'right',
          color: t.ink,
        }),
        captionBlock(
          'trabajo-rotulo',
          'Rótulo trabajo',
          [10, 98, 190, 5],
          labels['descripcion'] ?? '',
          t,
        ),
        text('trabajo', 'Trabajo realizado', [10, 104, 190, 52], {
          text: '{{descripcion}}',
          fontSize: 10,
          color: t.ink,
        }),
        captionBlock(
          'materiales-rotulo',
          'Rótulo materiales',
          [10, 160, 190, 5],
          labels['materiales'] ?? '',
          t,
        ),
        linesTable([10, 166, 190, 52], t, 6),
        noteBlock(
          'observaciones',
          'Observaciones',
          [10, 222, 190, 14],
          ['{{observaciones}}'],
          t,
          labels['observaciones'],
        ),
        ...signatureBlock('tecnico-firma', [10, 248, 90, 24], labels['firmaTecnico'] ?? '', t),
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
