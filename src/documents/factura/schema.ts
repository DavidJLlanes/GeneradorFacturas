import type { DataSchema, FieldSpec } from '../../core/document-type/types';
import { VAT_OPTIONS, VAT_RATES } from './vat';

const PAYMENT_METHODS = [
  { value: 'transferencia', label: 'Transferencia bancaria' },
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'domiciliacion', label: 'Domiciliación bancaria' },
  { value: 'otro', label: 'Otro' },
];

// Desglose por tipo de IVA: base, cuota y recargo. Calculados; solo existen si hay líneas con ese tipo.
const breakdown: FieldSpec[] = VAT_RATES.flatMap((rate) => [
  {
    key: `base${rate}`,
    label: `Base ${rate} %`,
    kind: 'money' as const,
    group: 'Totales',
    computed: true,
  },
  {
    key: `iva${rate}`,
    label: `IVA ${rate} %`,
    kind: 'money' as const,
    group: 'Totales',
    computed: true,
  },
  {
    key: `rec${rate}`,
    label: `Recargo ${rate} %`,
    kind: 'money' as const,
    group: 'Totales',
    computed: true,
  },
]);

export const schema: DataSchema = {
  version: 1,
  fields: [
    { key: 'serie', label: 'Serie', kind: 'text', group: 'Factura' },
    { key: 'numero', label: 'Número', kind: 'number', group: 'Factura', required: true },
    {
      key: 'numeroFactura',
      label: 'Número completo',
      kind: 'text',
      group: 'Factura',
      computed: true,
    },
    { key: 'fecha', label: 'Fecha de expedición', kind: 'date', group: 'Factura', required: true },
    { key: 'fechaOperacion', label: 'Fecha de la operación', kind: 'date', group: 'Factura' },
    { key: 'fechaVencimiento', label: 'Vencimiento', kind: 'date', group: 'Factura' },

    { key: 'emisor.logo', label: 'Logo', kind: 'image', group: 'Emisor' },
    {
      key: 'emisor.nombre',
      label: 'Nombre o razón social',
      kind: 'text',
      group: 'Emisor',
      required: true,
    },
    { key: 'emisor.nif', label: 'NIF', kind: 'text', group: 'Emisor', required: true },
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
    { key: 'cliente.email', label: 'Email', kind: 'text', group: 'Cliente' },

    {
      key: 'lineas',
      label: 'Líneas',
      kind: 'lines',
      group: 'Líneas',
      columns: [
        { key: 'concepto', label: 'Concepto', kind: 'text', width: 5 },
        { key: 'cantidad', label: 'Cant.', kind: 'number', width: 1.1 },
        { key: 'precio', label: 'Precio', kind: 'money', width: 1.8 },
        { key: 'descuento', label: 'Dto. %', kind: 'number', width: 1.1 },
        { key: 'iva', label: 'IVA', kind: 'choice', width: 1.3, options: VAT_OPTIONS },
        { key: 'importe', label: 'Importe', kind: 'money', width: 1.9, computed: true },
      ],
    },

    { key: 'irpf', label: 'Retención IRPF (%)', kind: 'number', group: 'Impuestos' },
    { key: 'recargo', label: 'Recargo de equivalencia', kind: 'toggle', group: 'Impuestos' },
    { key: 'motivoExencion', label: 'Mención de exención', kind: 'multiline', group: 'Impuestos' },

    { key: 'baseTotal', label: 'Base imponible', kind: 'money', group: 'Totales', computed: true },
    ...breakdown,
    { key: 'baseExenta', label: 'Base exenta', kind: 'money', group: 'Totales', computed: true },
    { key: 'ivaTotal', label: 'Total IVA', kind: 'money', group: 'Totales', computed: true },
    {
      key: 'recargoTotal',
      label: 'Total recargo',
      kind: 'money',
      group: 'Totales',
      computed: true,
    },
    { key: 'irpfCuota', label: 'Retención IRPF', kind: 'money', group: 'Totales', computed: true },
    { key: 'total', label: 'Total a pagar', kind: 'money', group: 'Totales', computed: true },
    {
      key: 'menciones',
      label: 'Menciones legales',
      kind: 'multiline',
      group: 'Totales',
      computed: true,
    },

    {
      key: 'formaPago',
      label: 'Forma de pago',
      kind: 'choice',
      group: 'Pago',
      options: PAYMENT_METHODS,
    },
    { key: 'iban', label: 'IBAN', kind: 'text', group: 'Pago' },
    { key: 'notas', label: 'Notas', kind: 'multiline', group: 'Pago' },
  ],
};
