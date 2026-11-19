import { createPage } from '../../../core/document/page';
import type { DocumentTemplate } from '../../../core/document-type/types';
import { separator } from '../../../core/template-kit/blocks';
import { DEFAULT_THEME as t, piece, text, withFont } from '../../../core/template-kit/pieces';

// Clásica: banda de color a la izquierda con el logo; nombre, cargo y contacto a la derecha (85 × 55 mm).
export const clasica: DocumentTemplate = {
  id: 'clasica',
  name: 'Clásica',
  document: {
    page: createPage(85, 55, 4),
    elements: withFont(
      [
        piece('banda', 'Banda', 'shape', [4, 4, 22, 47], {
          filled: true,
          fill: t.accent,
          bordered: false,
        }),
        piece('logo', 'Logo', 'image', [6, 8, 18, 18], { field: 'logo' }),
        text('empresa', 'Empresa', [30, 4, 51, 5], {
          text: '{{empresa}}',
          fontSize: 8,
          bold: true,
          color: t.accent,
        }),
        text('nombre', 'Nombre', [30, 11, 51, 8], {
          text: '{{nombre}}',
          fontSize: 13,
          bold: true,
          color: t.ink,
        }),
        text('cargo', 'Cargo', [30, 19, 51, 5], {
          text: '{{cargo}}',
          fontSize: 8.5,
          color: t.muted,
        }),
        separator([30, 27, 51, 1], t),
        text('contacto', 'Contacto', [30, 30, 51, 21], {
          text: '{{telefono}}\n{{email}}\n{{web}}\n{{direccion}}',
          fontSize: 7.5,
          color: t.ink,
        }),
      ],
      'inter',
    ),
  },
};
