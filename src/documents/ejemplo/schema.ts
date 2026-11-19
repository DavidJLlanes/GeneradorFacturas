import type { DataSchema } from '../../core/document-type/types';

export const schema: DataSchema = {
  version: 1,
  fields: [
    { key: 'titulo', label: 'Título', kind: 'text', group: 'Documento', required: true },
    { key: 'fecha', label: 'Fecha', kind: 'date', group: 'Documento' },
    { key: 'destinatario.nombre', label: 'Nombre', kind: 'text', group: 'Destinatario' },
    { key: 'notas', label: 'Notas', kind: 'multiline', group: 'Documento' },
  ],
};
