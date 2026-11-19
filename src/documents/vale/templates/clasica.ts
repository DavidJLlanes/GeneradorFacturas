import { createPage } from '../../../core/document/page';
import type { DocumentTemplate } from '../../../core/document-type/types';
import { logoBlock, noteBlock, numberBlock, titleBlock } from '../../../core/template-kit/blocks';
import { DEFAULT_THEME as t, piece, text, withFont } from '../../../core/template-kit/pieces';
import { labels } from '../labels.es';

// Clásica: A6 apaisado con el importe destacado a la izquierda y el código QR a la derecha.
export const clasica: DocumentTemplate = {
  id: 'clasica',
  name: 'Clásica',
  document: {
    page: createPage(148, 105, 8),
    elements: withFont(
      [
        logoBlock([8, 8, 35, 16]),
        titleBlock([80, 8, 60, 12], labels['titulo'] ?? '', t, 26),
        numberBlock([80, 21, 60, 6], 'Nº {{numeroVale}}', t, false),
        piece('importe-fondo', 'Fondo del importe', 'shape', [8, 32, 62, 18], {
          filled: true,
          fill: t.soft,
          bordered: false,
        }),
        text('importe', 'Importe', [8, 32, 62, 18], {
          text: '{{importe}}',
          fontSize: 22,
          bold: true,
          align: 'center',
          valign: 'middle',
          color: t.ink,
        }),
        text('concepto', 'Concepto', [8, 53, 90, 6], {
          text: '{{concepto}}',
          fontSize: 11,
          bold: true,
          color: t.accent,
        }),
        text('beneficiario', 'Beneficiario y validez', [8, 60, 90, 12], {
          text: `${labels['para']}: {{beneficiario.nombre}}\n${labels['validoHasta']}: {{validoHasta}}`,
          fontSize: 10,
          color: t.ink,
        }),
        noteBlock('condiciones', 'Condiciones', [8, 74, 92, 14], ['{{condiciones}}'], t),
        text('emisor', 'Emisor', [8, 90, 92, 7], {
          text: `{{emisor.nombre}} · ${labels['nif']} {{emisor.nif}}`,
          fontSize: 8,
          color: t.muted,
        }),
        piece('qr', 'Código QR', 'qr', [106, 52, 34, 34], { content: '{{codigo}}' }),
        text('codigo', 'Código', [100, 88, 40, 6], {
          text: '{{codigo}}',
          fontSize: 7,
          align: 'center',
          color: t.muted,
        }),
      ],
      'inter',
    ),
  },
};
