import type { DocumentData } from '../../core/document-type/types';

// Datos de muestra para ver el diseño relleno. Todos ficticios.
export const sampleData: DocumentData = {
  numero: 45,
  fecha: '2026-11-19',
  lugar: 'León',
  importe: 123456,
  concepto: 'Alquiler del local de la calle Mayor 1, correspondiente a noviembre de 2026.',
  formaPago: 'transferencia',
  'emisor.nombre': 'Ana Ejemplo Pérez',
  'emisor.nif': '00000000T',
  'emisor.direccion': 'Calle Mayor 1\n24001 León',
  'cliente.nombre': 'Cliente de Muestra, S.A.',
  'cliente.nif': 'A00000000',
  notas: 'Recibo sin IVA.',
};
