import type { DataSchema } from '../../core/document-type/types';

export const schema: DataSchema = {
  version: 1,
  fields: [
    { key: 'numero', label: 'Número', kind: 'number', group: 'Parte', required: true },
    { key: 'numeroParte', label: 'Número completo', kind: 'text', group: 'Parte', computed: true },
    { key: 'fecha', label: 'Fecha', kind: 'date', group: 'Parte', required: true },
    { key: 'tecnico', label: 'Técnico', kind: 'text', group: 'Parte' },
    { key: 'horaInicio', label: 'Hora de inicio (HH:MM)', kind: 'text', group: 'Parte' },
    { key: 'horaFin', label: 'Hora de fin (HH:MM)', kind: 'text', group: 'Parte' },
    { key: 'duracion', label: 'Duración', kind: 'text', group: 'Parte', computed: true },
    { key: 'emisor.logo', label: 'Logo', kind: 'image', group: 'Empresa' },
    {
      key: 'emisor.nombre',
      label: 'Nombre o razón social',
      kind: 'text',
      group: 'Empresa',
      required: true,
    },
    { key: 'emisor.nif', label: 'NIF', kind: 'text', group: 'Empresa' },
    { key: 'emisor.direccion', label: 'Domicilio', kind: 'multiline', group: 'Empresa' },
    { key: 'emisor.email', label: 'Email', kind: 'text', group: 'Empresa' },
    { key: 'emisor.telefono', label: 'Teléfono', kind: 'text', group: 'Empresa' },
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
      key: 'descripcion',
      label: 'Trabajo realizado',
      kind: 'multiline',
      group: 'Trabajo',
      required: true,
    },
    {
      key: 'lineas',
      label: 'Materiales',
      kind: 'lines',
      group: 'Trabajo',
      columns: [
        { key: 'concepto', label: 'Material', kind: 'text', width: 6 },
        { key: 'cantidad', label: 'Cantidad', kind: 'number', width: 1.4 },
        { key: 'unidad', label: 'Unidad', kind: 'text', width: 1.4 },
      ],
    },
    { key: 'observaciones', label: 'Observaciones', kind: 'multiline', group: 'Trabajo' },
  ],
};
