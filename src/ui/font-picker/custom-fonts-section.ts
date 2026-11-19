import { fontStack } from '../../fonts/catalog';
import { listCustomFonts, registerCustomFont } from '../../fonts/custom/custom-fonts';
import { readFontFile } from '../../fonts/custom/read-font-file';
import { ensureFont } from '../../fonts/load-font';

// Parte "Mis fuentes" del buscador: las fuentes propias ya añadidas y el botón para subir otra.
export function customFontRows(
  row: (label: string, family: string, id: string) => HTMLElement,
  onAdded: (id: string) => void,
): HTMLElement[] {
  const rows: HTMLElement[] = [];
  const heading = document.createElement('div');
  heading.className = 'fp-group';
  heading.textContent = 'Mis fuentes';
  rows.push(heading);

  for (const font of listCustomFonts()) {
    ensureFont(font.id);
    rows.push(row(font.name, fontStack(font.id), font.id));
  }

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2';
  input.hidden = true;
  const message = document.createElement('p');
  message.className = 'pd-hint';
  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'pd-btn';
  add.textContent = 'Añadir fuente propia…';
  add.addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) return;
    readFontFile(file).then(
      (font) => {
        registerCustomFont(font);
        onAdded(font.id);
      },
      (error: unknown) => {
        message.textContent = error instanceof Error ? error.message : 'No se pudo leer la fuente.';
      },
    );
  });
  message.textContent = 'Se guardan dentro del archivo de diseño. Máximo 1,5 MB.';
  rows.push(add, input, message);
  return rows;
}
