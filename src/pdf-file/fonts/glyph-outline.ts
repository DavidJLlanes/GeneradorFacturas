// Contorno de un glifo (en unidades de la fuente, con el eje Y hacia arriba) como trazo SVG ya
// escalado y volcado (eje Y hacia abajo), listo para dibujarlo en el PDF.

export interface OutlineCommand {
  command: string;
  args: readonly number[];
}

const round = (n: number): string => String(Math.round(n * 1000) / 1000);

export function outlineToSvg(
  commands: readonly OutlineCommand[],
  scale: number,
  dx: number,
  dy = 0,
): string {
  const point = (args: readonly number[], i: number): string =>
    `${round(dx + (args[i] ?? 0) * scale)} ${round(-((args[i + 1] ?? 0) + dy) * scale)}`;
  let out = '';
  for (const { command, args } of commands) {
    if (command === 'moveTo') out += `M${point(args, 0)}`;
    else if (command === 'lineTo') out += `L${point(args, 0)}`;
    else if (command === 'quadraticCurveTo') out += `Q${point(args, 0)} ${point(args, 2)}`;
    else if (command === 'bezierCurveTo') {
      out += `C${point(args, 0)} ${point(args, 2)} ${point(args, 4)}`;
    } else if (command === 'closePath') out += 'Z';
  }
  return out;
}
