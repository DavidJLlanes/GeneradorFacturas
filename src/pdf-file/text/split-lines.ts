// Reparte los caracteres de un texto (con la caja que ocupa cada uno en pantalla) en las líneas
// que el navegador ha formado. Es puro: la parte que mide el DOM vive en `char-boxes.ts`.

export interface CharBox {
  char: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface TextLine {
  text: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function splitLines(chars: readonly CharBox[]): TextLine[] {
  const lines: TextLine[] = [];
  let current: TextLine | null = null;
  for (const c of chars) {
    const middle = (c.top + c.bottom) / 2;
    if (current && middle >= current.top && middle <= current.bottom) {
      current.text += c.char;
      current.right = Math.max(current.right, c.right);
      current.top = Math.min(current.top, c.top);
      current.bottom = Math.max(current.bottom, c.bottom);
    } else {
      current = { text: c.char, left: c.left, right: c.right, top: c.top, bottom: c.bottom };
      lines.push(current);
    }
  }
  return lines
    .map((l) => ({ ...l, text: l.text.replace(/\s+$/, '') }))
    .filter((l) => l.text.trim() !== '');
}
