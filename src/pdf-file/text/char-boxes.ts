import { splitLines, type CharBox, type TextLine } from './split-lines';

// Líneas de un nodo de texto tal como las ha maquetado el navegador. Si todo cabe en una línea (lo
// habitual) basta una medida; si no, se mide carácter a carácter para saber dónde corta cada línea.
export function textLines(node: Text, collapse: boolean): TextLine[] {
  const raw = node.data;
  const range = document.createRange();
  range.selectNodeContents(node);
  const rects = [...range.getClientRects()].filter((r) => r.width > 0 || r.height > 0);
  if (rects.length === 0) return [];

  if (rects.length === 1) {
    const r = rects[0]!;
    const text = collapse ? raw.replace(/\s+/g, ' ').trim() : raw.replace(/\s+$/, '');
    return text === ''
      ? []
      : [{ text, left: r.left, right: r.right, top: r.top, bottom: r.bottom }];
  }

  const chars: CharBox[] = [];
  for (let i = 0; i < raw.length;) {
    const length = (raw.codePointAt(i) ?? 0) > 0xffff ? 2 : 1;
    const char = raw.slice(i, i + length);
    range.setStart(node, i);
    range.setEnd(node, i + length);
    const box = range.getClientRects()[0];
    if (box && char !== '\n' && (box.width > 0 || char.trim() === '')) {
      chars.push({ char, left: box.left, right: box.right, top: box.top, bottom: box.bottom });
    }
    i += length;
  }
  return splitLines(chars);
}
