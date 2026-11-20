import type { Editor } from '../../canvas/editor/create-editor';

// Región «en vivo» para lectores de pantalla: dice en voz alta lo que cambia y no se ve de otra
// manera (qué pieza queda seleccionada, qué página se muestra, si se ven los datos).
export function createAnnouncer(editor: Editor): { element: HTMLElement; destroy(): void } {
  const region = document.createElement('div');
  region.className = 'sr-only';
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', 'polite');

  let last = '';
  const say = (text: string): void => {
    if (text === last) return;
    last = text;
    region.textContent = text;
  };

  let before = editor.ui.get();
  const update = (): void => {
    const ui = editor.ui.get();
    const doc = editor.doc();
    if (ui.fillMode !== before.fillMode) {
      say(ui.fillMode ? 'Vista con datos' : 'Vista de plantilla');
    } else if (ui.selection !== before.selection) {
      const names = doc.elements.filter((e) => ui.selection.includes(e.id)).map((e) => e.name);
      say(
        names.length === 0
          ? 'Nada seleccionado'
          : names.length === 1
            ? `Seleccionado: ${names[0]}`
            : `${names.length} piezas seleccionadas`,
      );
    } else if (ui.pageIndex !== before.pageIndex && ui.fillMode) {
      say(`Página ${ui.pageIndex + 1}`);
    }
    before = ui;
  };

  return { element: region, destroy: editor.onChange(update) };
}
