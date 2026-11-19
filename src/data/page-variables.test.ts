import { describe, expect, it } from 'vitest';
import { withPageVariables } from './page-variables';

const keep = (t: string): string => t;

describe('variables de página', () => {
  it('rellena la página y el total, con o sin espacios', () => {
    const resolve = withPageVariables(keep, 2, 5);
    expect(resolve('Página {{pagina}} de {{paginas}}')).toBe('Página 2 de 5');
    expect(resolve('{{ pagina }}/{{ paginas }}')).toBe('2/5');
  });

  it('no confunde `pagina` con `paginas` ni toca otras variables', () => {
    const resolve = withPageVariables((t) => t.replace('{{x}}', 'X'), 1, 3);
    expect(resolve('{{paginas}}{{pagina}}{{x}}{{otra}}')).toBe('31X{{otra}}');
  });

  it('aplica después el resolvedor de datos', () => {
    const resolve = withPageVariables((t) => t.toUpperCase(), 1, 1);
    expect(resolve('hola {{pagina}}')).toBe('HOLA 1');
  });
});
