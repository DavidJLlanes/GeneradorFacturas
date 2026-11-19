import type { DocumentData } from '../../core/document-type/types';

// Datos de muestra para ver el diseño relleno. Todos ficticios.
export const sampleData: DocumentData = {
  numero: 9,
  codigo: 'VALE-2026-0009-K7Q2',
  importe: 5000,
  concepto: 'Vale regalo',
  fecha: '2026-11-19',
  validoHasta: '2027-05-19',
  'beneficiario.nombre': 'María de Muestra',
  'emisor.nombre': 'Taller Ejemplo, S.L.',
  'emisor.nif': 'B00000000',
  'emisor.direccion': 'Calle Mayor 1, 24001 León',
  condiciones:
    'Canjeable en tienda. No acumulable a otras ofertas. No se devuelve el importe sobrante.',
};
