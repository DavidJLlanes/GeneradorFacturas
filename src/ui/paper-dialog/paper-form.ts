import type { Page } from '../../core/document/types';
import type { AdaptMode } from '../../paper/adapt-elements';
import { matchPreset } from '../../paper/match-preset';
import { orientationOf, withOrientation, type Orientation } from '../../paper/orientation';
import { pageForPreset, pageWithMargins, pageWithSize } from '../../paper/page-builders';
import { GROUP_NAMES, PAPER_PRESETS, presetById } from '../../paper/paper-presets';
import { MAX_PAGE_MM, MIN_PAGE_MM } from '../../paper/size-limits';
import { checkField, numberField, selectField } from '../fields/form-fields';

const CUSTOM = 'custom';

export interface PaperForm {
  element: HTMLElement;
  load(page: Page, showMargins: boolean): void;
  page(): Page;
  adapt(): AdaptMode;
  showMargins(): boolean;
  onShowMargins(listener: (value: boolean) => void): void;
}

// Formulario del papel: mantiene un borrador de página y lo refleja en los campos.
export function createPaperForm(): PaperForm {
  const preset = selectField('Papel', [
    ...PAPER_PRESETS.map((p) => ({ value: p.id, label: p.name, group: GROUP_NAMES[p.group] })),
    { value: CUSTOM, label: 'Personalizado' },
  ]);
  const orientation = selectField('Orientación', [
    { value: 'portrait', label: 'Vertical' },
    { value: 'landscape', label: 'Horizontal' },
  ]);
  const width = numberField('Ancho (mm)', MIN_PAGE_MM, MAX_PAGE_MM);
  const height = numberField('Alto (mm)', MIN_PAGE_MM, MAX_PAGE_MM);
  const lock = checkField('Mantener proporción');
  const margins = {
    top: numberField('Margen superior (mm)', 0, MAX_PAGE_MM),
    right: numberField('Margen derecho (mm)', 0, MAX_PAGE_MM),
    bottom: numberField('Margen inferior (mm)', 0, MAX_PAGE_MM),
    left: numberField('Margen izquierdo (mm)', 0, MAX_PAGE_MM),
  };
  const show = checkField('Mostrar márgenes en el lienzo');
  const adapt = selectField('Piezas al cambiar de tamaño', [
    { value: 'stretch', label: 'Estirar para llenar el papel' },
    { value: 'fit', label: 'Escalar sin deformar y centrar' },
    { value: 'keep', label: 'Dejarlas donde están' },
  ]);

  let draft: Page;
  let ratio = 1;

  const render = (): void => {
    preset.input.value = matchPreset(draft)?.id ?? CUSTOM;
    orientation.input.value = orientationOf(draft);
    width.input.value = String(draft.widthMm);
    height.input.value = String(draft.heightMm);
    for (const side of ['top', 'right', 'bottom', 'left'] as const) {
      margins[side].input.value = String(draft.marginsMm[side]);
    }
  };
  const setDraft = (page: Page): void => {
    draft = page;
    render();
  };
  const num = (input: HTMLInputElement): number => Number(input.value.replace(',', '.'));

  preset.input.addEventListener('change', () => {
    const chosen = presetById(preset.input.value);
    if (chosen) setDraft(pageForPreset(draft, chosen));
  });
  orientation.input.addEventListener('change', () =>
    setDraft(withOrientation(draft, orientation.input.value as Orientation)),
  );
  width.input.addEventListener('change', () => {
    const w = num(width.input);
    setDraft(pageWithSize(draft, w, lock.input.checked ? w * ratio : draft.heightMm));
  });
  height.input.addEventListener('change', () => {
    const h = num(height.input);
    setDraft(pageWithSize(draft, lock.input.checked ? h / ratio : draft.widthMm, h));
  });
  for (const side of ['top', 'right', 'bottom', 'left'] as const) {
    margins[side].input.addEventListener('change', () =>
      setDraft(pageWithMargins(draft, { ...draft.marginsMm, [side]: num(margins[side].input) })),
    );
  }
  lock.input.addEventListener('change', () => {
    ratio = draft.heightMm / draft.widthMm;
  });

  const element = document.createElement('div');
  element.className = 'pd-fields';
  element.append(
    preset.row,
    orientation.row,
    width.row,
    height.row,
    lock.row,
    margins.top.row,
    margins.right.row,
    margins.bottom.row,
    margins.left.row,
    show.row,
    adapt.row,
  );

  return {
    element,
    load(page, showMargins) {
      ratio = page.heightMm / page.widthMm;
      lock.input.checked = false;
      show.input.checked = showMargins;
      setDraft(page);
    },
    page: () => draft,
    adapt: () => adapt.input.value as AdaptMode,
    showMargins: () => show.input.checked,
    onShowMargins: (listener) =>
      show.input.addEventListener('change', () => listener(show.input.checked)),
  };
}
