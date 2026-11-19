// Reglas para las imágenes que sube la persona (logo, sellos, firmas…).

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'] as const;
export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

/** Tamaño máximo del archivo que se acepta. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
/** Un SVG es texto: se limita más para no inflar el archivo de diseño. */
export const MAX_SVG_BYTES = 500 * 1024;
/** Lado mayor máximo, en píxeles, de una imagen rasterizada (suficiente para 300 ppp en A5). */
export const MAX_IMAGE_SIDE_PX = 1600;
/** Por debajo de este tamaño y de MAX_IMAGE_SIDE_PX se conserva el archivo original. */
export const KEEP_ORIGINAL_BYTES = 1.5 * 1024 * 1024;

export const isAllowedImageType = (type: string): type is AllowedImageType =>
  (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type);

// Tamaño final de una imagen para que su lado mayor no pase de `max`, sin deformarla ni ampliarla.
export function fitWithin(width: number, height: number, max: number): { w: number; h: number } {
  const longest = Math.max(width, height);
  if (longest <= max) return { w: width, h: height };
  const k = max / longest;
  return { w: Math.max(1, Math.round(width * k)), h: Math.max(1, Math.round(height * k)) };
}

export const isImageDataUrl = (value: unknown): value is string =>
  typeof value === 'string' && /^data:image\/(png|jpeg|svg\+xml);base64,/.test(value);
