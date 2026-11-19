import type { DocumentData } from '../../core/document-type/types';

// Datos de muestra para ver el diseño relleno. Todos ficticios.
export const sampleData: DocumentData = {
  numero: 31,
  fecha: '2026-11-19',
  referencia: 'PED-2026-118',
  transportista: 'Transportes Ejemplo',
  'emisor.nombre': 'Taller Ejemplo, S.L.',
  'emisor.nif': 'B00000000',
  'emisor.direccion': 'Calle Mayor 1\n24001 León',
  'emisor.email': 'hola@ejemplo.test',
  'emisor.telefono': '987 00 00 00',
  'cliente.nombre': 'Cliente de Muestra, S.A.',
  'cliente.nif': 'A00000000',
  'cliente.direccion': 'Avenida del Sol 25\n28001 Madrid',
  'entrega.direccion': 'Almacén central\nPolígono Industrial 7, nave 3\n28850 Torrejón de Ardoz',
  lineas: [
    { concepto: 'Cajas de embalaje 40×30×20', cantidad: 120, unidad: 'ud.' },
    { concepto: 'Cinta adhesiva transparente', cantidad: 24, unidad: 'rollos' },
    { concepto: 'Papel de burbuja', cantidad: 6.5, unidad: 'm²' },
  ],
  observaciones: 'Mercancía revisada en origen. Reclamaciones en un máximo de 48 horas.',
};
