import type { Editor } from '../editor/create-editor';
import { zoomToFit } from '../commands/view-commands';
import { updateGuidesOverlay } from './guides-overlay';
import { updateMarqueeOverlay } from './marquee-overlay';
import { createPageNav } from './page-nav';
import { createRulers } from './rulers';
import { updateSelectionOverlay } from './selection-overlay';
import { viewModelOf } from './view-model';
import { createWorldView } from './world-view';
import './canvas-view.css';

export interface CanvasView {
  element: HTMLElement;
  /** Zona donde se dibuja la página; recibe los eventos del puntero. */
  stage: HTMLElement;
  destroy(): void;
}

const div = (className: string): HTMLDivElement => {
  const node = document.createElement('div');
  node.className = className;
  return node;
};

export function createCanvasView(editor: Editor): CanvasView {
  const root = div('cv');
  const stage = div('cv-stage');
  const rulers = createRulers();
  const world = createWorldView();

  const overlay = div('cv-overlay');
  const guidesLayer = div('cv-layer');
  const selectionLayer = div('cv-layer');
  const marqueeLayer = div('cv-layer');
  overlay.append(guidesLayer, selectionLayer, marqueeLayer);

  const pageNav = createPageNav(editor);
  stage.append(world.element, overlay);
  root.append(div('cv-corner'), rulers.horizontal, rulers.vertical, stage, pageNav.element);

  const render = (): void => {
    const doc = editor.doc();
    const ui = editor.ui.get();
    const model = viewModelOf(editor);
    world.update(doc, ui, model);
    pageNav.update(model);
    updateGuidesOverlay(guidesLayer, ui);
    updateSelectionOverlay(selectionLayer, doc, ui);
    updateMarqueeOverlay(marqueeLayer, ui);
    rulers.update(ui.viewport, ui.containerSize);
    stage.classList.toggle('is-space', ui.spaceHeld && !ui.panning);
    stage.classList.toggle('is-panning', ui.panning);
  };

  // Al conocer el tamaño por primera vez, se encuadra la página.
  let fitted = false;
  const observer = new ResizeObserver(() => {
    const size = { w: stage.clientWidth, h: stage.clientHeight };
    const current = editor.ui.get().containerSize;
    if (size.w === current.w && size.h === current.h) return;
    editor.ui.update((s) => ({ ...s, containerSize: size }));
    if (!fitted && size.w > 0 && size.h > 0) {
      fitted = true;
      zoomToFit(editor);
    }
  });
  observer.observe(stage);

  const off = editor.onChange(render);
  render();

  return {
    element: root,
    stage,
    destroy() {
      off();
      observer.disconnect();
    },
  };
}
