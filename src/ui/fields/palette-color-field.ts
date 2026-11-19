import { PALETTE_KEYS, PALETTE_LABELS, type Palette } from '../../styles/palette';
import { paletteKeyOf, resolveColor, tokenOf } from '../../styles/resolve-color';
import { option } from './form-fields';
import './palette-color-field.css';

const CUSTOM = 'custom';

export interface PaletteColorField {
  row: HTMLElement;
  /** Control principal (el desplegable); sirve para saber si el usuario está editando el campo. */
  input: HTMLSelectElement;
  /** Refleja un valor (`@nombre` o un color propio). No toca el campo mientras se edita. */
  set(value: string | undefined): void;
  onChange(listener: (value: string) => void): void;
}

// Campo de color con la paleta del documento: se elige un color con nombre (que sigue a la paleta si
// cambia) o uno propio.
export function createPaletteColorField(
  label: string,
  getPalette: () => Palette,
): PaletteColorField {
  const row = document.createElement('label');
  row.className = 'pd-row pcf';
  const span = document.createElement('span');
  span.textContent = label;

  const select = document.createElement('select');
  for (const key of PALETTE_KEYS) select.append(option(PALETTE_LABELS[key], tokenOf(key)));
  select.append(option('Color propio', CUSTOM));

  const color = document.createElement('input');
  color.type = 'color';
  color.className = 'pcf-swatch';

  const box = document.createElement('div');
  box.className = 'pcf-box';
  box.append(select, color);
  row.append(span, box);

  const showColor = (): void => {
    const key = paletteKeyOf(select.value);
    color.disabled = key !== null;
    if (key) color.value = getPalette()[key];
  };

  return {
    row,
    input: select,
    set(value) {
      if (document.activeElement === select || document.activeElement === color) return;
      const key = paletteKeyOf(value);
      select.value = key ? tokenOf(key) : CUSTOM;
      color.value = resolveColor(value ?? '#000000', getPalette());
      showColor();
    },
    onChange(listener) {
      select.addEventListener('change', () => {
        if (select.value === CUSTOM) {
          color.disabled = false;
          listener(color.value);
        } else {
          showColor();
          listener(select.value);
        }
      });
      color.addEventListener('change', () => listener(color.value));
    },
  };
}
