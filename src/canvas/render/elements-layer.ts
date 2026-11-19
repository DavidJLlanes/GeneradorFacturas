import type { DocElement } from '../../core/document/types';
import { mmToPx } from '../../core/units/units';

// Mantiene un nodo DOM por elemento, reutilizándolo entre cambios para no perder el estado del puntero.
export function createElementsLayer(): {
  element: HTMLElement;
  update(elements: readonly DocElement[]): void;
} {
  const element = document.createElement('div');
  element.className = 'cv-elements';
  const nodes = new Map<string, HTMLElement>();

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

  return {
    element,
    update(elements) {
      const alive = new Set<string>();
      elements.forEach((el, index) => {
        alive.add(el.id);
        const node = nodeFor(el);
        node.style.left = `${mmToPx(el.x)}px`;
        node.style.top = `${mmToPx(el.y)}px`;
        node.style.width = `${mmToPx(el.w)}px`;
        node.style.height = `${mmToPx(el.h)}px`;
        node.style.zIndex = String(index);
        node.style.display = el.hidden ? 'none' : '';
        node.classList.toggle('is-locked', el.locked);
        if (node.textContent !== el.name) node.textContent = el.name;
      });
      for (const [id, node] of nodes) {
        if (!alive.has(id)) {
          node.remove();
          nodes.delete(id);
        }
      }
    },
  };
}
