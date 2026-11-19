import type { DocElement, PieceProps } from '../../../core/document/types';
import { labels } from '../labels.es';

// Piezas comunes a las plantillas de factura. Cada plantilla las coloca y les da su paleta.

export interface Theme {
  /** Color de acento: rótulos, cabecera de la tabla, destacados. */
  accent: string;
  /** Color del texto principal. */
  ink: string;
  /** Color del texto secundario. */
  muted: string;
  /** Fondo suave para filas alternas y destacados. */
  soft: string;
}

type Box = readonly [x: number, y: number, w: number, h: number];

export const piece = (
  id: string,
  name: string,
  kind: string,
  [x, y, w, h]: Box,
  props: PieceProps = {},
): DocElement => ({ id, name, kind, props, x, y, w, h, locked: false, hidden: false });

const text = (id: string, name: string, box: Box, props: PieceProps): DocElement =>
  piece(id, name, 'text', box, props);

export const logo = (box: Box): DocElement =>
  piece('logo', 'Logo', 'image', box, { field: 'emisor.logo' });

export const issuerName = (box: Box, t: Theme, color = t.ink): DocElement =>
  text('emisor-nombre', 'Emisor', box, {
    text: '{{emisor.nombre}}',
    fontSize: 12,
    bold: true,
    color,
  });

export const issuerDetails = (box: Box, t: Theme, color = t.muted): DocElement =>
  text('emisor-datos', 'Datos del emisor', box, {
    text: `${labels['nif']} {{emisor.nif}}\n{{emisor.direccion}}\n{{emisor.email}} · {{emisor.telefono}}`,
    fontSize: 9,
    color,
  });

export const title = (box: Box, color: string): DocElement =>
  text('titulo', 'Título', box, {
    text: labels['titulo'] ?? '',
    fontSize: 28,
    bold: true,
    align: 'right',
    color,
  });

export const number = (box: Box, color: string): DocElement =>
  text('numero', 'Número', box, {
    text: 'Nº {{numeroFactura}}',
    fontSize: 13,
    align: 'right',
    color,
  });

export const dates = (box: Box, color: string): DocElement =>
  text('fechas', 'Fechas', box, {
    text: `${labels['fecha']}: {{fecha}}\n${labels['fechaOperacion']}: {{fechaOperacion}}\n${labels['vencimiento']}: {{fechaVencimiento}}`,
    fontSize: 9,
    align: 'right',
    color,
  });

export const clientLabel = (box: Box, t: Theme): DocElement =>
  text('cliente-rotulo', 'Rótulo cliente', box, {
    text: (labels['facturaA'] ?? '').toUpperCase(),
    fontSize: 8,
    bold: true,
    color: t.accent,
  });

export const clientName = (box: Box, t: Theme): DocElement =>
  text('cliente-nombre', 'Cliente', box, {
    text: '{{cliente.nombre}}',
    fontSize: 12,
    bold: true,
    color: t.ink,
  });

export const clientDetails = (box: Box, t: Theme): DocElement =>
  text('cliente-datos', 'Datos del cliente', box, {
    text: `${labels['nif']} {{cliente.nif}}\n{{cliente.direccion}}\n{{cliente.email}}`,
    fontSize: 9,
    color: t.muted,
  });

export const linesTable = (box: Box, t: Theme): DocElement =>
  piece('tabla', 'Líneas', 'table', box, {
    field: 'lineas',
    headerFill: t.accent,
    headerColor: '#ffffff',
    zebraFill: t.soft,
    color: t.ink,
    minRows: 14,
  });

// Bases por tipo de IVA (obligatorias cuando hay varios tipos). Solo salen las que tienen valor.
export const basesBlock = (box: Box, t: Theme): DocElement =>
  piece('bases', 'Bases por tipo', 'totals', box, {
    rows: [
      'Base 21 % | {{base21}}',
      'Base 10 % | {{base10}}',
      'Base 4 % | {{base4}}',
      'Base 0 % | {{base0}}',
      'Base exenta | {{baseExenta}}',
    ].join('\n'),
    fontSize: 8.5,
    rowHeight: 5.5,
    color: t.muted,
    hideUnresolved: true,
    highlightLast: false,
  });

export const totalsBlock = (box: Box, t: Theme): DocElement =>
  piece('totales', 'Totales', 'totals', box, {
    rows: [
      `${labels['baseImponible']} | {{baseTotal}}`,
      `${labels['iva']} 21 % | {{iva21}}`,
      `${labels['iva']} 10 % | {{iva10}}`,
      `${labels['iva']} 4 % | {{iva4}}`,
      `${labels['recargo']} | {{recargoTotal}}`,
      `${labels['irpf']} | -{{irpfCuota}}`,
      `${labels['total']} | {{total}}`,
    ].join('\n'),
    fontSize: 9.5,
    rowHeight: 5.5,
    color: t.ink,
    hideUnresolved: true,
    highlightLast: true,
    highlightFill: t.soft,
    ruleColor: t.accent,
  });

export const paymentBlock = (box: Box, t: Theme): DocElement =>
  text('pago', 'Pago y notas', box, {
    text: `${labels['formaPago']}: {{formaPago}}\n${labels['iban']}: {{iban}}\n{{menciones}}\n{{notas}}`,
    fontSize: 8.5,
    color: t.muted,
  });

export const footerBand = (box: Box, t: Theme): DocElement =>
  piece('pie', 'Pie', 'footer', box, {
    text: `{{emisor.nombre}} · ${labels['nif']} {{emisor.nif}}`,
    color: t.muted,
    ruleColor: t.accent,
  });
