import { createPage } from '../../../core/document/page';
import type { DocumentTemplate } from '../../../core/document-type/types';
import { partyBlock } from '../../../core/template-kit/blocks';
import { DEFAULT_THEME as t, text, withFont } from '../../../core/template-kit/pieces';
import { labels } from '../labels.es';

// Clásica: remitente arriba a la izquierda, destinatario y fecha a la derecha, cuerpo y firma.
export const clasica: DocumentTemplate = {
  id: 'clasica',
  name: 'Clásica',
  document: {
    page: createPage(210, 297, 20),
    elements: withFont(
      [
        ...partyBlock(
          'remitente',
          [20, 20, 80],
          {
            name: '{{remitente.nombre}}',
            details: [
              `${labels['nif']} {{remitente.nif}}`,
              '{{remitente.direccion}}',
              '{{remitente.email}} · {{remitente.telefono}}',
            ],
            detailsH: 20,
          },
          t,
        ),
        text('fecha', 'Lugar y fecha', [110, 20, 80, 6], {
          text: '{{lugar}}, {{fecha}}',
          fontSize: 10,
          align: 'right',
          color: t.muted,
        }),
        ...partyBlock(
          'destinatario',
          [110, 52, 80],
          {
            name: '{{destinatario.nombre}}',
            details: [`${labels['nif']} {{destinatario.nif}}`, '{{destinatario.direccion}}'],
            detailsH: 14,
          },
          t,
        ),
        text('asunto', 'Asunto', [20, 90, 170, 7], {
          text: `${labels['asunto']}: {{asunto}}`,
          fontSize: 11,
          bold: true,
          color: t.accent,
        }),
        text('cuerpo', 'Texto de la carta', [20, 102, 170, 120], {
          text: '{{cuerpo}}',
          fontSize: 11,
          lineHeight: 1.45,
          color: t.ink,
        }),
        text('plazo', 'Plazo de respuesta', [20, 226, 170, 6], {
          text: `${labels['plazo']} {{fechaLimite}}`,
          fontSize: 10,
          bold: true,
          color: t.ink,
        }),
        text('firma', 'Despedida y firma', [20, 238, 90, 28], {
          text: `${labels['atentamente']}\n\n\n{{remitente.nombre}}`,
          fontSize: 11,
          color: t.ink,
        }),
      ],
      'inter',
    ),
  },
};
