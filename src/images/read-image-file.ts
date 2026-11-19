import {
  KEEP_ORIGINAL_BYTES,
  MAX_FILE_BYTES,
  MAX_IMAGE_SIDE_PX,
  MAX_SVG_BYTES,
  fitWithin,
  isAllowedImageType,
} from './image-limits';

const toDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(blob);
  });

async function readSvg(file: File): Promise<string> {
  if (file.size > MAX_SVG_BYTES) throw new Error('El SVG pesa demasiado (máximo 500 KB).');
  const root = new DOMParser().parseFromString(await file.text(), 'image/svg+xml').documentElement;
  if (root.localName !== 'svg') throw new Error('El archivo no es un SVG válido.');
  return toDataUrl(file);
}

async function readRaster(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error('No se pudo abrir la imagen.');
  });
  try {
    const size = fitWithin(bitmap.width, bitmap.height, MAX_IMAGE_SIDE_PX);
    const resized = size.w !== bitmap.width || size.h !== bitmap.height;
    if (!resized && file.size <= KEEP_ORIGINAL_BYTES) return await toDataUrl(file);

    const canvas = document.createElement('canvas');
    canvas.width = size.w;
    canvas.height = size.h;
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, size.w, size.h);
    // PNG conserva la transparencia; el resto se guarda como JPEG.
    return file.type === 'image/png'
      ? canvas.toDataURL('image/png')
      : canvas.toDataURL('image/jpeg', 0.9);
  } finally {
    bitmap.close();
  }
}

// Lee una imagen subida y la devuelve como data URL lista para guardar en el diseño.
// Las imágenes grandes se reducen. Lanza un Error con un mensaje para mostrar a la persona.
export async function readImageFile(file: File): Promise<string> {
  if (!isAllowedImageType(file.type)) throw new Error('Formato no admitido: usa PNG, JPG o SVG.');
  if (file.size > MAX_FILE_BYTES) throw new Error('La imagen pesa demasiado (máximo 10 MB).');
  return file.type === 'image/svg+xml' ? readSvg(file) : readRaster(file);
}
