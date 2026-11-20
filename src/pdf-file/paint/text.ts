import { rgb } from 'pdf-lib';
import { parseCssColor } from '../color/css-color';
import { outlineToSvg, type OutlineCommand } from '../fonts/glyph-outline';
import { runsFor, standardSafe } from '../fonts/font-book';
import { textLines } from '../text/char-boxes';
import { PT_PER_PX, type PaintContext } from './context';

// Escribe un nodo de texto línea a línea, en el sitio exacto donde lo ha puesto el navegador.
export async function paintText(
  ctx: PaintContext,
  node: Text,
  cs: CSSStyleDeclaration,
): Promise<void> {
  const color = parseCssColor(cs.color);
  if (!color || color.a === 0) return;
  const size = (parseFloat(cs.fontSize) || 0) * PT_PER_PX;
  if (size <= 0) return;
  const collapse = !cs.whiteSpace.startsWith('pre');
  const lines = textLines(node, collapse);
  if (lines.length === 0) return;

  const face = await ctx.fonts.face({
    family: cs.fontFamily,
    weight: parseInt(cs.fontWeight, 10) || 400,
    italic: cs.fontStyle === 'italic' || cs.fontStyle === 'oblique',
  });
  const content = (face.ascent + face.descent) * size;

  for (const line of lines) {
    // La caja medida del texto es el área de contenido de la fuente: la línea base cuelga de ella.
    const boxHeight = (line.bottom - line.top) * PT_PER_PX;
    const baselineFromTop =
      (line.top - ctx.originY) * PT_PER_PX + (boxHeight - content) / 2 + face.ascent * size;
    const left = (line.left - ctx.originX) * PT_PER_PX;
    const baseline = ctx.page.getHeight() - baselineFromTop;
    const paint = rgb(color.r, color.g, color.b);
    const opacity = color.a * ctx.opacity;

    // Los glifos se dibujan como contornos: así sale igual que en pantalla con cualquier fuente.
    let path = '';
    let x = 0;
    for (const run of runsFor(face, line.text)) {
      if (!run.kit) {
        const text = standardSafe(face, run.text);
        ctx.page.drawText(text, {
          x: left + x,
          y: baseline,
          size,
          font: face.fallback,
          color: paint,
          opacity,
        });
        x += face.fallback.widthOfTextAtSize(text, size);
        continue;
      }
      const scale = size / run.kit.unitsPerEm;
      const layout = run.kit.layout(run.text);
      layout.glyphs.forEach((glyph, i) => {
        const at = layout.positions[i];
        const commands = (glyph.path as unknown as { commands: readonly OutlineCommand[] })
          .commands;
        path += outlineToSvg(commands, scale, x + (at?.xOffset ?? 0) * scale, at?.yOffset ?? 0);
        x += (at?.xAdvance ?? 0) * scale;
      });
    }
    if (path) {
      ctx.page.drawSvgPath(path, { x: left, y: baseline, color: paint, opacity, borderWidth: 0 });
    }
    // Texto invisible encima, para poder seleccionarlo, copiarlo y buscarlo en el PDF.
    ctx.page.drawText(standardSafe(face, line.text), {
      x: left,
      y: baseline,
      size,
      font: face.fallback,
      opacity: 0,
    });
  }
}
