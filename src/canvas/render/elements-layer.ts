import type { DataSchema } from '../../core/document-type/types';
import type { DocElement } from '../../core/document/types';
import { mmToPx } from '../../core/units/units';
import { pieces } from '../../pieces/discover';
import type { Palette } from '../../styles/palette';
import { resolveColorProps } from '../../styles/resolve-color';

// Datos con los que se dibujan las piezas. `version` cambia cuando cambia algo que afecta al dibujo
// (por ejemplo los datos del documento), para saber cuándo hay que redibujar piezas sin cambios.
export interface PieceRenderContext {
  resolve(text: string): string;
  schema: DataSchema | null;
  value(key: string): unknown;
  fillMode: boolean;
  version: unknown;
}

interface Drawn {
  element: DocElement;
  version: unknown;
  palette: Palette;
}

// Mantiene un nodo DOM por elemento, reutilizándolo entre cambios para no perder el estado del puntero.
// Una pieza solo se redibuja si cambió ella misma o el contexto.
export function createElementsLayer(): {
  element: HTMLElement;
  update(elements: readonly DocElement[], context: PieceRenderContext, palette: Palette): void;
} {
  const element = document.createElement('div');
  element.className = 'cv-elements';
  const nodes = new Map<string, HTMLElement>();
  const drawn = new Map<string, Drawn>();

  const nodeFor = (el: DocElement): HTMLElement => {
    let node = nodes.get(el.id);
    if (!node) {
      node = document.createElement('div');
      node.className = 'cv-el';
      node.dataset.id = el.id;
      element.append(node);
      nodes.set(el.id, node);
    }
    return node;
  };

  const draw = (
    node: HTMLElement,
    el: DocElement,
    context: PieceRenderContext,
    palette: Palette,
  ): void => {
    const last = drawn.get(el.id);
    if (
      last &&
      last.element === el &&
      last.version === context.version &&
      last.palette === palette
    ) {
      return;
    }
    drawn.set(el.id, { element: el, version: context.version, palette });
    const piece = pieces.get(el.kind);
    if (!piece) {
      node.textContent = el.name;
      return;
    }
    piece.render(node, {
      props: resolveColorProps(pieces.propsOf(el), piece.props, palette),
      widthMm: el.w,
      heightMm: el.h,
      resolve: context.resolve,
      schema: context.schema,
      value: context.value,
      fillMode: context.fillMode,
    });
  };

  return {
    element,
    update(elements, context, palette) {
      const alive = new Set<string>();
      elements.forEach((el, index) => {
        alive.add(el.id);
        const node = nodeFor(el);
        node.style.left = `${mmToPx(el.x)}px`;
        node.style.top = `${mmToPx(el.y)}px`;
        node.style.width = `${mmToPx(el.w)}px`;
        node.style.height = `${mmToPx(el.h)}px`;
        node.style.zIndex = String(index);
        // Con el atributo `hidden` (y no con `display`) para no pisar el `display` que fija cada pieza.
        node.hidden = el.hidden;
        node.classList.toggle('is-locked', el.locked);
        draw(node, el, context, palette);
      });
      for (const [id, node] of nodes) {
        if (!alive.has(id)) {
          node.remove();
          nodes.delete(id);
          drawn.delete(id);
        }
      }
    },
  };
}
