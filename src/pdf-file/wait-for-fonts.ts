// Espera a que el navegador tenga cargadas todas las fuentes que usa lo que hay dentro de `root`.
// Medir antes de tiempo daría las medidas de la fuente de reserva y el PDF saldría descuadrado.
export async function waitForFonts(root: HTMLElement): Promise<void> {
  const wanted = new Map<string, string>();
  const walk = (el: Element): void => {
    const text = [...el.childNodes]
      .filter((n): n is Text => n instanceof Text)
      .map((n) => n.data)
      .join('');
    if (text.trim() !== '') {
      const cs = getComputedStyle(el);
      const spec = `${cs.fontStyle} ${cs.fontWeight} 16px ${cs.fontFamily}`;
      wanted.set(spec, (wanted.get(spec) ?? '') + text.slice(0, 400));
    }
    for (const child of el.children) walk(child);
  };
  walk(root);
  await Promise.all(
    [...wanted].map(([spec, text]) => document.fonts.load(spec, text).catch(() => [])),
  );
  await document.fonts.ready;
  await Promise.all(
    [...root.querySelectorAll('img')].map((img) => img.decode().catch(() => undefined)),
  );
}
