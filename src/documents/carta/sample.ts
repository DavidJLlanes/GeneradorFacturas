import type { DocumentData } from '../../core/document-type/types';

// Datos de muestra para ver el diseño relleno. Todos ficticios.
export const sampleData: DocumentData = {
  fecha: '2026-11-19',
  lugar: 'León',
  asunto: 'Reclamación por producto defectuoso (pedido 2026-118)',
  cuerpo:
    'Muy señores míos:\n\nEl pasado 3 de noviembre recibí el pedido 2026-118, que contenía una lámpara de mesa con el cable de alimentación dañado. Lo comuniqué por correo electrónico el mismo día y no he recibido respuesta.\n\nPor ello solicito la sustitución del producto o, en su defecto, la devolución del importe abonado (45,00 €), conforme a la normativa de defensa de los consumidores.\n\nQuedo a la espera de su respuesta.',
  plazoDias: 15,
  'remitente.nombre': 'María de Muestra',
  'remitente.nif': '00000000T',
  'remitente.direccion': 'Calle Mayor 1, 3.º B\n24001 León',
  'remitente.email': 'maria@ejemplo.test',
  'remitente.telefono': '600 00 00 00',
  'destinatario.nombre': 'Tienda de Muestra, S.L.',
  'destinatario.nif': 'B00000000',
  'destinatario.direccion': 'Avenida del Sol 25\n28001 Madrid',
};
