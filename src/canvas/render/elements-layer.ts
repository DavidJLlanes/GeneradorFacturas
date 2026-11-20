import type { DataSchema } from '../../core/document-type/types';
import { mmToPx } from '../../core/units/units';
import type { PlacedItem } from '../../layout/types';
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
  currency: string;
  version: unknown;
}

interface Drawn {
  item: PlacedItem;
  version: unknown;
  palette: Palette;
}

// Mantiene un nodo DOM por elemento, reutilizándolo entre cambios para no perder el estado del puntero.
// Una pieza solo se redibuja si cambió ella misma o el contexto.
export function createElementsLayer(): {
  element: HTMLElement;
  update(items: readonly PlacedItem[], context: PieceRenderContext, palette: Palette): void;
} {
  const element = document.createElement('div');
  element.className = 'cv-elements';
  const nodes = new Map<string, HTMLElement>();
  const drawn = new Map<string, Drawn>();

  const nodeFor = (el: PlacedItem['element']): HTMLElement => {
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
    item: PlacedItem,
    context: PieceRenderContext,
    palette: Palette,
  ): void => {
    const el = item.element;
    const last = drawn.get(el.id);
    if (
      last &&
      last.item === item &&
      last.version === context.version &&
      last.palette === palette
    ) {
      return;
    }
    drawn.set(el.id, { item, version: context.version, palette });
    const piece = pieces.get(el.kind);
    if (!piece) {
      node.textContent = el.name;
      return;
    }
    piece.render(node, {
      props: resolveColorProps(pieces.propsOf(el), piece.props, palette),
      widthMm: item.rect.w,
      heightMm: item.rect.h,
      resolve: context.resolve,
      schema: context.schema,
      value: context.value,
      fillMode: context.fillMode,
      currency: context.currency,
      ...(item.slice ? { slice: item.slice } : {}),
    });
  };

  return {
    element,
    update(items, context, palette) {
      const alive = new Set<string>();
      items.forEach((item, index) => {
        const el = item.element;
        alive.add(el.id);
        const node = nodeFor(el);
        node.style.left = `${mmToPx(item.rect.x)}px`;
        node.style.top = `${mmToPx(item.rect.y)}px`;
        node.style.width = `${mmToPx(item.rect.w)}px`;
        node.style.height = `${mmToPx(item.rect.h)}px`;
        node.style.zIndex = String(index);
        // Con el atributo `hidden` (y no con `display`) para no pisar el `display` que fija cada pieza.
        node.hidden = el.hidden;
        node.classList.toggle('is-locked', el.locked);
        draw(node, item, context, palette);
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
