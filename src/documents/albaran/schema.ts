import type { DataSchema } from '../../core/document-type/types';

export const schema: DataSchema = {
  version: 1,
  fields: [
    { key: 'serie', label: 'Serie', kind: 'text', group: 'Albarán' },
    { key: 'numero', label: 'Número', kind: 'number', group: 'Albarán', required: true },
    {
      key: 'numeroAlbaran',
      label: 'Número completo',
      kind: 'text',
      group: 'Albarán',
      computed: true,
    },
    { key: 'fecha', label: 'Fecha de entrega', kind: 'date', group: 'Albarán', required: true },
    { key: 'referencia', label: 'Pedido o referencia', kind: 'text', group: 'Albarán' },
    { key: 'transportista', label: 'Transportista', kind: 'text', group: 'Albarán' },

    { key: 'emisor.logo', label: 'Logo', kind: 'image', group: 'Emisor' },
    {
      key: 'emisor.nombre',
      label: 'Nombre o razón social',
      kind: 'text',
      group: 'Emisor',
      required: true,
    },
    { key: 'emisor.nif', label: 'NIF', kind: 'text', group: 'Emisor' },
    { key: 'emisor.direccion', label: 'Domicilio', kind: 'multiline', group: 'Emisor' },
    { key: 'emisor.email', label: 'Email', kind: 'text', group: 'Emisor' },
    { key: 'emisor.telefono', label: 'Teléfono', kind: 'text', group: 'Emisor' },

    {
      key: 'cliente.nombre',
      label: 'Nombre o razón social',
      kind: 'text',
      group: 'Cliente',
      required: true,
    },
    { key: 'cliente.nif', label: 'NIF', kind: 'text', group: 'Cliente' },
    { key: 'cliente.direccion', label: 'Domicilio', kind: 'multiline', group: 'Cliente' },
    {
      key: 'entrega.direccion',
      label: 'Dirección de entrega',
      kind: 'multiline',
      group: 'Cliente',
    },

    {
      key: 'lineas',
      label: 'Artículos',
      kind: 'lines',
      group: 'Artículos',
      columns: [
        { key: 'concepto', label: 'Descripción', kind: 'text', width: 6 },
        { key: 'cantidad', label: 'Cantidad', kind: 'number', width: 1.4 },
        { key: 'unidad', label: 'Unidad', kind: 'text', width: 1.4 },
      ],
    },
    {
      key: 'totalUnidades',
      label: 'Total de unidades',
      kind: 'number',
      group: 'Totales',
      computed: true,
    },

    { key: 'observaciones', label: 'Observaciones', kind: 'multiline', group: 'Observaciones' },
  ],
};
