import { bandStyle } from '../../../core/template-kit/band-style';
import { clasica } from './clasica';

// Moderna: la clásica con una banda de color a todo el ancho arriba y el título y el número en blanco.
export const moderna = bandStyle(clasica, { id: 'moderna', name: 'Moderna' });
