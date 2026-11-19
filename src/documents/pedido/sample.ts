import type { DocumentData } from '../../core/document-type/types';

// Datos de muestra para ver el diseño relleno. Todos ficticios.
export const sampleData: DocumentData = {
  numero: 18,
  fecha: '2026-11-19',
  fechaEntrega: '2026-12-03',
  'emisor.nombre': 'Taller Ejemplo, S.L.',
  'emisor.nif': 'B00000000',
  'emisor.direccion': 'Calle Mayor 1\n24001 León',
  'emisor.email': 'compras@ejemplo.test',
  'emisor.telefono': '987 00 00 00',
  'proveedor.nombre': 'Suministros de Muestra, S.A.',
  'proveedor.nif': 'A00000000',
  'proveedor.direccion': 'Polígono Industrial 7\n28850 Torrejón de Ardoz',
  'proveedor.email': 'pedidos@proveedor.test',
  lugarEntrega: 'Almacén central\nCalle Mayor 1, 24001 León',
  lineas: [
    { concepto: 'Tablero de roble 2440×1220×18 mm', cantidad: 12, precio: 6890, iva: '21' },
    { concepto: 'Barniz al agua 5 l', cantidad: 4, precio: 3250, iva: '21' },
    { concepto: 'Lijas grano 120 (caja 50 ud.)', cantidad: 3, precio: 1490, iva: '21' },
  ],
  condiciones: 'Pago a 30 días desde la recepción.\nEntrega con albarán firmado.',
};
