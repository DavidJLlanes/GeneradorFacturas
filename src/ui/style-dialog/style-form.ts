import {
  DEFAULT_PALETTE,
  PALETTE_KEYS,
  PALETTE_LABELS,
  type Palette,
  type PaletteKey,
} from '../../styles/palette';
import { matchTheme, themeById, THEMES } from '../../styles/themes';
import { colorField, selectField } from '../fields/form-fields';

const CUSTOM = 'custom';

export interface StyleForm {
  element: HTMLElement;
  load(palette: Palette): void;
  palette(): Palette;
}

// Formulario de la paleta: un tema de partida y el ajuste fino de cada color.
export function createStyleForm(): StyleForm {
  const theme = selectField('Tema', [
    ...THEMES.map((t) => ({ value: t.id, label: t.name })),
    { value: CUSTOM, label: 'Personalizado' },
  ]);
  const colors = Object.fromEntries(
    PALETTE_KEYS.map((key) => [key, colorField(PALETTE_LABELS[key])]),
  ) as Record<PaletteKey, ReturnType<typeof colorField>>;

  const read = (): Palette =>
    Object.fromEntries(PALETTE_KEYS.map((key) => [key, colors[key].input.value])) as Palette;
  const write = (palette: Palette): void => {
    for (const key of PALETTE_KEYS) colors[key].input.value = palette[key];
    theme.input.value = matchTheme(palette)?.id ?? CUSTOM;
  };

  theme.input.addEventListener('change', () => {
    const chosen = themeById(theme.input.value);
    if (chosen) write(chosen.palette);
  });
  for (const key of PALETTE_KEYS) {
    colors[key].input.addEventListener('input', () => {
      theme.input.value = matchTheme(read())?.id ?? CUSTOM;
    });
  }

  const element = document.createElement('div');
  element.className = 'pd-fields';
  element.append(theme.row, ...PALETTE_KEYS.map((key) => colors[key].row));
  write(DEFAULT_PALETTE);

  return { element, load: write, palette: read };
}
