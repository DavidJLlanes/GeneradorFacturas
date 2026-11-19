import { createPage } from '../../../core/document/page';
import type { DocumentTemplate } from '../../../core/document-type/types';
import {
  DEFAULT_THEME as t,
  frame,
  piece,
  rule,
  text,
  withFont,
} from '../../../core/template-kit/pieces';
import { labels } from '../labels.es';

// Clásica: A5 apaisado con el importe destacado, el texto «Recibí de…» y el recuadro de firma.
export const clasica: DocumentTemplate = {
  id: 'clasica',
  name: 'Clásica',
  document: {
    page: createPage(210, 148),
    elements: withFont(
      [
        piece('logo', 'Logo', 'image', [10, 10, 40, 18], { field: 'emisor.logo' }),
        text('titulo', 'Título', [110, 10, 90, 12], {
          text: labels['titulo'] ?? '',
          fontSize: 24,
          bold: true,
          align: 'right',
          color: t.accent,
        }),
        text('numero', 'Número', [110, 23, 90, 7], {
          text: 'Nº {{numeroRecibo}}',
          fontSize: 12,
          align: 'right',
          color: t.ink,
        }),
        text('fechas', 'Fecha y lugar', [110, 30, 90, 10], {
          text: `${labels['fecha']}: {{fecha}}\n${labels['lugar']}: {{lugar}}`,
          fontSize: 9,
          align: 'right',
          color: t.muted,
        }),
        rule('separador', [10, 42, 190, 1], t.accent),
        piece('importe-fondo', 'Fondo del importe', 'shape', [10, 48, 70, 16], {
          filled: true,
          fill: t.soft,
          bordered: false,
        }),
        text('importe', 'Importe', [10, 48, 70, 16], {
          text: '{{importe}}',
          fontSize: 20,
          bold: true,
          align: 'center',
          valign: 'middle',
          color: t.ink,
        }),
        text('cuerpo', 'Texto del recibo', [10, 68, 190, 26], {
          text:
            'Recibí de {{cliente.nombre}} (NIF {{cliente.nif}}) la cantidad de {{importe}} ' +
            '({{importeLetras}}) en concepto de:\n{{concepto}}\n' +
            `${labels['formaPago']}: {{formaPago}}`,
          fontSize: 10.5,
          color: t.ink,
        }),
        text('emisor-datos', 'Datos de quien recibe', [10, 96, 100, 19], {
          text: `{{emisor.nombre}}\n${labels['nif']} {{emisor.nif}}\n{{emisor.direccion}}`,
          fontSize: 9,
          color: t.muted,
        }),
        text('firma-rotulo', 'Rótulo de la firma', [120, 94, 80, 5], {
          text: (labels['firma'] ?? '').toUpperCase(),
          fontSize: 8,
          bold: true,
          color: t.accent,
        }),
        frame('firma', 'Firma', [120, 100, 80, 26], t.muted),
        text('notas', 'Notas', [10, 118, 100, 8], {
          text: '{{notas}}',
          fontSize: 8.5,
          color: t.muted,
        }),
      ],
      'inter',
    ),
  },
};
