import type { DataSchema } from '../../core/document-type/types';

export const schema: DataSchema = {
  version: 1,
  fields: [
    { key: 'fecha', label: 'Fecha', kind: 'date', group: 'Carta', required: true },
    { key: 'lugar', label: 'Lugar', kind: 'text', group: 'Carta' },
    { key: 'asunto', label: 'Asunto', kind: 'text', group: 'Carta', required: true },
    {
      key: 'cuerpo',
      label: 'Texto de la carta',
      kind: 'multiline',
      group: 'Carta',
      required: true,
    },
    { key: 'plazoDias', label: 'Plazo para responder (días)', kind: 'number', group: 'Carta' },
    { key: 'fechaLimite', label: 'Fecha límite', kind: 'date', group: 'Carta', computed: true },
    {
      key: 'remitente.nombre',
      label: 'Nombre o razón social',
      kind: 'text',
      group: 'Remitente',
      required: true,
    },
    { key: 'remitente.nif', label: 'NIF', kind: 'text', group: 'Remitente' },
    { key: 'remitente.direccion', label: 'Domicilio', kind: 'multiline', group: 'Remitente' },
    { key: 'remitente.email', label: 'Email', kind: 'text', group: 'Remitente' },
    { key: 'remitente.telefono', label: 'Teléfono', kind: 'text', group: 'Remitente' },
    {
      key: 'destinatario.nombre',
      label: 'Nombre o razón social',
      kind: 'text',
      group: 'Destinatario',
      required: true,
    },
    { key: 'destinatario.nif', label: 'NIF', kind: 'text', group: 'Destinatario' },
    { key: 'destinatario.direccion', label: 'Domicilio', kind: 'multiline', group: 'Destinatario' },
  ],
};
