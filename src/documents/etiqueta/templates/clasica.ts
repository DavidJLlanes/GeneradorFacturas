import { createPage } from '../../../core/document/page';
import type { DocumentTemplate } from '../../../core/document-type/types';
import { DEFAULT_THEME as t, piece, text, withFont } from '../../../core/template-kit/pieces';
import { labels } from '../labels.es';

// Clásica: nombre y descripción a la izquierda, precio destacado abajo y QR a la derecha (100 × 60 mm).
export const clasica: DocumentTemplate = {
  id: 'clasica',
  name: 'Clásica',
  document: {
    page: createPage(100, 60, 4),
    elements: withFont(
      [
        text('marca', 'Marca', [4, 4, 60, 5], {
          text: '{{emisor.nombre}}',
          fontSize: 8,
          bold: true,
          color: t.accent,
        }),
        text('producto', 'Producto', [4, 10, 62, 12], {
          text: '{{producto}}',
          fontSize: 14,
          bold: true,
          color: t.ink,
        }),
        text('descripcion', 'Descripción', [4, 23, 62, 14], {
          text: '{{descripcion}}',
          fontSize: 8,
          color: t.muted,
        }),
        text('referencia', 'Referencia y lote', [4, 38, 62, 5], {
          text: `${labels['ref']} {{referencia}} · ${labels['lote']} {{lote}}`,
          fontSize: 7.5,
          color: t.muted,
        }),
        piece('precio-fondo', 'Fondo del precio', 'shape', [4, 45, 40, 11], {
          filled: true,
          fill: t.accent,
          bordered: false,
        }),
        text('precio', 'Precio', [4, 45, 40, 11], {
          text: '{{precio}}',
          fontSize: 16,
          bold: true,
          align: 'center',
          valign: 'middle',
          color: '@onPrimary',
        }),
        piece('qr', 'Código QR', 'qr', [68, 4, 28, 28], { content: '{{codigo}}' }),
      ],
      'inter',
    ),
  },
};
