import qrcode from 'qrcode-generator';

// El estándar admite UTF-8 en modo byte; por defecto la biblioteca usa solo ASCII.
qrcode.stringToBytes = (text: string): number[] => Array.from(new TextEncoder().encode(text));

export type QrLevel = 'L' | 'M' | 'Q' | 'H';

// Matriz de módulos del QR (true = oscuro) o null si el texto no cabe o está vacío.
export function qrMatrix(text: string, level: QrLevel): boolean[][] | null {
  if (text === '') return null;
  try {
    const qr = qrcode(0, level);
    qr.addData(text);
    qr.make();
    const n = qr.getModuleCount();
    return Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => qr.isDark(r, c)),
    );
  } catch {
    return null;
  }
}
