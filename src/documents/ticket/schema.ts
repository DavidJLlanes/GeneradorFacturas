import type { DataSchema } from '../../core/document-type/types';

export const schema: DataSchema = {
  version: 1,
  fields: [
    { key: 'numero', label: 'Número', kind: 'number', group: 'Ticket', required: true },
    {
      key: 'numeroTicket',
      label: 'Número completo',
      kind: 'text',
      group: 'Ticket',
      computed: true,
    },
    { key: 'fecha', label: 'Fecha', kind: 'date', group: 'Ticket', required: true },
    { key: 'hora', label: 'Hora', kind: 'text', group: 'Ticket' },
    { key: 'emisor.logo', label: 'Logo', kind: 'image', group: 'Comercio' },
    {
      key: 'emisor.nombre',
      label: 'Nombre o razón social',
      kind: 'text',
      group: 'Comercio',
      required: true,
    },
    { key: 'emisor.nif', label: 'NIF', kind: 'text', group: 'Comercio' },
    { key: 'emisor.direccion', label: 'Domicilio', kind: 'multiline', group: 'Comercio' },
    { key: 'emisor.telefono', label: 'Teléfono', kind: 'text', group: 'Comercio' },
    {
      key: 'lineas',
      label: 'Artículos',
      kind: 'lines',
      group: 'Artículos',
      columns: [
        { key: 'concepto', label: 'Artículo', kind: 'text', width: 4 },
        { key: 'cantidad', label: 'Ud.', kind: 'number', width: 1 },
        { key: 'precio', label: 'Precio', kind: 'money', width: 1.7 },
        { key: 'importe', label: 'Importe', kind: 'money', width: 1.9, computed: true },
      ],
    },
    {
      key: 'iva',
      label: 'IVA incluido en los precios',
      kind: 'choice',
      group: 'Totales',
      options: [
        { value: '21', label: '21 %' },
        { value: '10', label: '10 %' },
        { value: '4', label: '4 %' },
        { value: '0', label: '0 %' },
      ],
    },
    { key: 'total', label: 'Total', kind: 'money', group: 'Totales', computed: true },
    { key: 'ivaIncluido', label: 'IVA incluido', kind: 'money', group: 'Totales', computed: true },
    {
      key: 'formaPago',
      label: 'Forma de pago',
      kind: 'choice',
      group: 'Pago',
      options: [
        { value: 'efectivo', label: 'Efectivo' },
        { value: 'tarjeta', label: 'Tarjeta' },
        { value: 'bizum', label: 'Bizum' },
      ],
    },
    { key: 'mensaje', label: 'Mensaje final', kind: 'multiline', group: 'Pago' },
  ],
};
