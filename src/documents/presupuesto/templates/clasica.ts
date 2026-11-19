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

// Clásica: emisor a la izquierda, datos del presupuesto a la derecha, condiciones y recuadro de aceptación.
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
            text: 'Nº {{numeroPresupuesto}}',
            fontSize: 13,
            align: 'right',
            color: t.ink,
          }),
        ),
        text('fechas', 'Fechas', [105, 33, 95, 10], {
          text: `${labels['fecha']}: {{fecha}}\n${labels['validoHasta']}: {{validoHasta}}`,
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
        text('cliente-rotulo', 'Rótulo cliente', [10, 68, 90, 5], {
          text: (labels['presupuestoPara'] ?? '').toUpperCase(),
          fontSize: 8,
          bold: true,
          color: t.accent,
        }),
        text('cliente-nombre', 'Cliente', [10, 73, 110, 7], {
          text: '{{cliente.nombre}}',
          fontSize: 12,
          bold: true,
          color: t.ink,
        }),
        text('cliente-datos', 'Datos del cliente', [10, 80, 110, 16], {
          text: `${labels['nif']} {{cliente.nif}}\n{{cliente.direccion}}\n{{cliente.email}}`,
          fontSize: 9,
          color: t.muted,
        }),
        piece('tabla', 'Líneas', 'table', [10, 102, 190, 100], {
          field: 'lineas',
          headerFill: t.accent,
          headerColor: '@onPrimary',
          zebraFill: t.soft,
          color: t.ink,
          minRows: 12,
        }),
        text('condiciones', 'Condiciones y notas', [10, 208, 110, 30], {
          text: `${(labels['condiciones'] ?? '').toUpperCase()}\n{{condiciones}}\n{{notas}}`,
          fontSize: 8.5,
          color: t.muted,
        }),
        piece('totales', 'Totales', 'totals', [125, 208, 75, 28], {
          rows: [
            `${labels['baseImponible']} | {{baseTotal}}`,
            `${labels['iva']} 21 % | {{iva21}}`,
            `${labels['iva']} 10 % | {{iva10}}`,
            `${labels['iva']} 4 % | {{iva4}}`,
            `${labels['total']} | {{total}}`,
          ].join('\n'),
          fontSize: 9.5,
          rowHeight: 5.5,
          color: t.ink,
          hideUnresolved: true,
          highlightLast: true,
          highlightFill: t.soft,
          ruleColor: t.accent,
        }),
        text('aceptacion-rotulo', 'Rótulo aceptación', [10, 242, 120, 5], {
          text: labels['aceptacion'] ?? '',
          fontSize: 8,
          bold: true,
          color: t.accent,
        }),
        frame('aceptacion', 'Aceptación', [10, 248, 90, 24], t.muted),
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
