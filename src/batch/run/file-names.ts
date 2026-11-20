import { fileSlug } from '../../storage/files/file-name';

// Nombre del PDF de cada documento: su posición con ceros delante (para que se ordenen) y, si hay,
// el dato elegido (p. ej. el número o el cliente). Con la posición delante nunca se repiten.
export function pdfFileName(index: number, total: number, label: string): string {
  const width = Math.max(3, String(total).length);
  const position = String(index + 1).padStart(width, '0');
  const slug = label.trim() === '' ? '' : `-${fileSlug(label, '')}`;
  return `${position}${slug.replace(/-$/, '')}.pdf`;
}
