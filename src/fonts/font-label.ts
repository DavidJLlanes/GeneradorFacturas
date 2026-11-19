import { fontById } from './catalog';
import { customFontById, isCustomFontId } from './custom/custom-fonts';

// Nombre que se muestra para el id de una fuente (del catálogo, propia o la del sistema).
export function fontLabel(id: string): string {
  if (isCustomFontId(id)) return customFontById(id)?.name ?? 'Fuente no disponible';
  return fontById(id)?.name ?? 'Sistema';
}
