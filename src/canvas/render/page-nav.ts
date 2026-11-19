import { nextPage, previousPage } from '../commands/page-view-commands';
import type { Editor } from '../editor/create-editor';
import type { ViewModel } from './view-model';

const button = (label: string, title: string, onClick: () => void): HTMLButtonElement => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'cv-pagenav-btn';
  b.textContent = label;
  b.title = title;
  b.setAttribute('aria-label', title);
  b.addEventListener('click', onClick);
  // Para que pulsar aquí no inicie un gesto sobre la página.
  b.addEventListener('pointerdown', (e) => e.stopPropagation());
  return b;
};

// Selector de página sobre el lienzo; solo aparece si el documento relleno ocupa más de una.
export function createPageNav(editor: Editor): {
  element: HTMLElement;
  update(model: ViewModel): void;
} {
  const root = document.createElement('div');
  root.className = 'cv-pagenav';
  root.hidden = true;
  const prev = button('‹', 'Página anterior (Re Pág)', () => previousPage(editor));
  const next = button('›', 'Página siguiente (Av Pág)', () => nextPage(editor));
  const label = document.createElement('span');
  label.className = 'cv-pagenav-label';
  label.setAttribute('aria-live', 'polite');
  root.append(prev, label, next);

  return {
    element: root,
    update(model) {
      root.hidden = model.pageCount <= 1;
      label.textContent = `Página ${model.pageIndex + 1} de ${model.pageCount}`;
      prev.disabled = model.pageIndex === 0;
      next.disabled = model.pageIndex >= model.pageCount - 1;
    },
  };
}
