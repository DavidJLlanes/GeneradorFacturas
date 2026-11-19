// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { DEFAULT_PALETTE } from '../../styles/palette';
import { themeById } from '../../styles/themes';
import { createStyleForm } from './style-form';

const themeSelect = (form: ReturnType<typeof createStyleForm>) =>
  form.element.querySelector<HTMLSelectElement>('select')!;

describe('formulario de la paleta', () => {
  it('carga la paleta y reconoce el tema al que corresponde', () => {
    const form = createStyleForm();
    form.load(themeById('azul')!.palette);
    expect(themeSelect(form).value).toBe('azul');
    expect(form.palette()).toEqual(themeById('azul')!.palette);
  });

  it('elegir un tema rellena todos los colores', () => {
    const form = createStyleForm();
    form.load(DEFAULT_PALETTE);
    const select = themeSelect(form);
    select.value = 'verde';
    select.dispatchEvent(new Event('change'));
    expect(form.palette()).toEqual(themeById('verde')!.palette);
  });

  it('ajustar un color pasa el tema a "Personalizado" y se conserva el resto', () => {
    const form = createStyleForm();
    form.load(DEFAULT_PALETTE);
    const first = form.element.querySelector<HTMLInputElement>('input[type=color]')!;
    first.value = '#ff0000';
    first.dispatchEvent(new Event('input'));
    expect(themeSelect(form).value).toBe('custom');
    expect(form.palette().primary).toBe('#ff0000');
    expect(form.palette().text).toBe(DEFAULT_PALETTE.text);
  });
});
