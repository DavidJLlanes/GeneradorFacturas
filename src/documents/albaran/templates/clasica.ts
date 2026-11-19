import { createPage } from '../../../core/document/page';
import type { DocumentTemplate } from '../../../core/document-type/types';
import {
  DEFAULT_THEME as t,
  frame,
  piece,
  repeating,
  rule,
  text,
  withFont,
} from '../../../core/template-kit/pieces';
import { labels } from '../labels.es';

const caption = (id: string, name: string, box: [number, number, number, number], value: string) =>
  text(id, name, box, { text: value.toUpperCase(), fontSize: 8, bold: true, color: t.accent });

// Clásica: datos del cliente y de la entrega arriba, tabla sin precios y dos recuadros de firma.
export const clasica: DocumentTemplate = {
  id: 'clasica',
  name: 'Clásica',
  document: {
    page: createPage(210, 297),
    elements: withFont(
      [
        piece('logo', 'Logo', 'image', [10, 10, 45, 22], { field: 'emisor.logo' }),
        text('titulo', 'Título', [105, 10, 95, 13], {
          text: labels['titulo'] ?? '',
          fontSize: 28,
          bold: true,
          align: 'right',
          color: t.accent,
        }),
        repeating(
          text('numero', 'Número', [105, 24, 95, 7], {
            text: 'Nº {{numeroAlbaran}}',
            fontSize: 13,
            align: 'right',
            color: t.ink,
          }),
        ),
        text('fechas', 'Fechas', [105, 33, 95, 14], {
          text: `${labels['fecha']}: {{fecha}}\n${labels['pedido']}: {{referencia}}\n${labels['transportista']}: {{transportista}}`,
          fontSize: 9,
          align: 'right',
          color: t.muted,
        }),
        text('emisor-nombre', 'Emisor', [10, 36, 90, 7], {
          text: '{{emisor.nombre}}',
          fontSize: 12,
          bold: true,
          color: t.ink,
        }),
        text('emisor-datos', 'Datos del emisor', [10, 43, 90, 16], {
          text: `${labels['nif']} {{emisor.nif}}\n{{emisor.direccion}}\n{{emisor.email}} · {{emisor.telefono}}`,
          fontSize: 9,
          color: t.muted,
        }),
        rule('separador', [10, 63, 190, 1], t.accent),
        caption('cliente-rotulo', 'Rótulo cliente', [10, 68, 90, 5], labels['entregarA'] ?? ''),
        text('cliente-nombre', 'Cliente', [10, 73, 95, 7], {
          text: '{{cliente.nombre}}',
          fontSize: 12,
          bold: true,
          color: t.ink,
        }),
        text('cliente-datos', 'Datos del cliente', [10, 80, 95, 16], {
          text: `${labels['nif']} {{cliente.nif}}\n{{cliente.direccion}}`,
          fontSize: 9,
          color: t.muted,
        }),
        caption(
          'entrega-rotulo',
          'Rótulo entrega',
          [112, 68, 88, 5],
          labels['direccionEntrega'] ?? '',
        ),
        text('entrega-datos', 'Dirección de entrega', [112, 73, 88, 23], {
          text: '{{entrega.direccion}}',
          fontSize: 10,
          color: t.ink,
        }),
        piece('tabla', 'Artículos', 'table', [10, 102, 190, 100], {
          field: 'lineas',
          headerFill: t.accent,
          headerColor: '@onPrimary',
          zebraFill: t.soft,
          color: t.ink,
          minRows: 12,
        }),
        text('observaciones', 'Observaciones', [10, 208, 110, 28], {
          text: `${(labels['observaciones'] ?? '').toUpperCase()}\n{{observaciones}}`,
          fontSize: 8.5,
          color: t.muted,
        }),
        text('total-unidades', 'Total de unidades', [125, 208, 75, 7], {
          text: `${labels['totalUnidades']}: {{totalUnidades}}`,
          fontSize: 10,
          bold: true,
          align: 'right',
          color: t.ink,
        }),
        caption(
          'entregado-rotulo',
          'Rótulo entregado',
          [10, 242, 90, 5],
          labels['entregado'] ?? '',
        ),
        frame('entregado', 'Entregado', [10, 248, 90, 24], t.muted),
        caption('recibido-rotulo', 'Rótulo recibido', [110, 242, 90, 5], labels['recibido'] ?? ''),
        frame('recibido', 'Recibido', [110, 248, 90, 24], t.muted),
        repeating(
          piece('pie', 'Pie', 'footer', [10, 277, 190, 10], {
            text: `{{emisor.nombre}} · ${labels['nif']} {{emisor.nif}} · Página {{pagina}} de {{paginas}}`,
            color: t.muted,
            ruleColor: t.accent,
          }),
        ),
      ],
      'inter',
    ),
  },
};
