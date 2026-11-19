// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { commitActiveField } from './commit-active-field';

describe('commitActiveField', () => {
  it('suelta el campo con foco para que se confirme lo escrito', () => {
    const input = document.createElement('input');
    document.body.append(input);
    input.focus();
    const onBlur = vi.fn();
    input.addEventListener('blur', onBlur);
    commitActiveField();
    expect(onBlur).toHaveBeenCalledOnce();
    expect(document.activeElement).not.toBe(input);
  });

  it('no toca otros elementos con foco', () => {
    const button = document.createElement('button');
    document.body.append(button);
    button.focus();
    commitActiveField();
    expect(document.activeElement).toBe(button);
  });
});
