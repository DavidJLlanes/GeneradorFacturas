import { createPage } from '../core/document/page';
import type { DocElement, DocumentModel, PieceProps } from '../core/document/types';

// Documento de prueba para probar el lienzo. Se sustituirá por el tipo Factura (Fase 5).
const piece = (
  id: string,
  name: string,
  kind: string,
  props: PieceProps,
  [x, y, w, h]: [number, number, number, number],
): DocElement => ({ id, name, kind, props, x, y, w, h, locked: false, hidden: false });

export function createDemoDocument(): DocumentModel {
  return {
    page: createPage(210, 297),
    elements: [
      piece(
        'demo-1',
        'Cabecera',
        'text',
        { text: '{{titulo}}', fontSize: 26, bold: true },
        [15, 15, 180, 30],
      ),
      piece(
        'demo-2',
        'Datos del cliente',
        'text',
        { text: 'Para: {{destinatario.nombre}}\nFecha: {{fecha}}' },
        [15, 55, 85, 35],
      ),
      piece('demo-3', 'Tabla', 'shape', { filled: false }, [15, 100, 180, 110]),
      piece('demo-5', 'Separador', 'line', {}, [15, 215, 180, 2]),
      piece('demo-4', 'Totales', 'shape', { shape: 'rect', radius: 2 }, [120, 225, 75, 40]),
    ],
  };
}
