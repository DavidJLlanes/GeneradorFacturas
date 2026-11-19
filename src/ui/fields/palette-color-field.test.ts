// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { DEFAULT_PALETTE } from '../../styles/palette';
import { createPaletteColorField } from './palette-color-field';

const make = () => {
  const palette = { ...DEFAULT_PALETTE, primary: '#112233' };
  const field = createPaletteColorField('Color', () => palette);
  const color = field.row.querySelector<HTMLInputElement>('input[type=color]')!;
  const changes: string[] = [];
  field.onChange((v) => changes.push(v));
  return { field, color, changes };
};

describe('campo de color con paleta', () => {
  it('un color enlazado muestra el nombre y el color real, sin poder editarlo a mano', () => {
    const { field, color } = make();
    field.set('@primary');
    expect(field.input.value).toBe('@primary');
    expect(color.value).toBe('#112233');
    expect(color.disabled).toBe(true);
  });

  it('un color propio selecciona "Color propio" y deja editar el color', () => {
    const { field, color } = make();
    field.set('#abcdef');
    expect(field.input.value).toBe('custom');
    expect(color.value).toBe('#abcdef');
    expect(color.disabled).toBe(false);
  });

  it('elegir un nombre de la paleta avisa con el enlace', () => {
    const { field, changes } = make();
    field.input.value = '@muted';
    field.input.dispatchEvent(new Event('change'));
    expect(changes).toEqual(['@muted']);
  });

  it('pasar a color propio conserva el color que se veía', () => {
    const { field, color, changes } = make();
    field.set('@primary');
    field.input.value = 'custom';
    field.input.dispatchEvent(new Event('change'));
    expect(changes).toEqual(['#112233']);
    expect(color.disabled).toBe(false);
  });

  it('cambiar el color propio avisa con el nuevo valor', () => {
    const { field, color, changes } = make();
    field.set('#abcdef');
    color.value = '#000001';
    color.dispatchEvent(new Event('change'));
    expect(changes).toEqual(['#000001']);
  });
});
