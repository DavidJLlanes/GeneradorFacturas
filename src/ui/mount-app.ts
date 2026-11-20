import type { Editor } from '../canvas/editor/create-editor';
import { attachPointerInput } from '../canvas/input/pointer-input';
import { attachInlineEdit } from '../canvas/input/inline-edit';
import { attachWheelInput } from '../canvas/input/wheel-input';
import { createCanvasView } from '../canvas/render/create-canvas-view';
import { attachPrint } from '../pdf/print-document';
import { attachKeyboardShortcuts } from '../canvas/shortcuts/keyboard-shortcuts';
import { createAnnouncer } from './announcer/announcer';
import { createDataPanel } from './data-panel/data-panel';
import { createLayersPanel } from './layers-panel/layers-panel';
import { createPropsPanel } from './props-panel/props-panel';
import { createSideTabs } from './side-tabs/side-tabs';
import { attachDoubleTap } from './touch/double-tap';
import { createToolbar } from './toolbar/toolbar';
import { APP_NAME } from '../core/app-info';
import './app-layout.css';
import './touch/touch.css';

// Monta la aplicación completa en `root`.
export function mountApp(root: HTMLElement, editor: Editor): void {
  root.className = 'app';

  const toolbar = createToolbar(editor);
  const view = createCanvasView(editor);
  const layers = createLayersPanel(editor);
  const props = createPropsPanel(editor);
  const data = createDataPanel(editor);
  const design = document.createElement('div');
  design.className = 'app-side';
  design.append(layers.element, props.element);
  const side = createSideTabs([
    { id: 'design', label: 'Diseño', element: design },
    { id: 'data', label: 'Datos', element: data.element },
  ]);

  // Zonas de la página para lectores de pantalla y para saltar de una a otra.
  const heading = document.createElement('h1');
  heading.className = 'sr-only';
  heading.textContent = APP_NAME;
  const skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#documento';
  skip.textContent = 'Saltar al documento';
  skip.addEventListener('click', (e) => {
    e.preventDefault();
    view.stage.focus();
  });

  view.stage.id = 'documento';
  view.stage.tabIndex = -1;
  view.stage.setAttribute('role', 'region');
  view.stage.setAttribute(
    'aria-label',
    'Documento. Con una pieza elegida en Capas, las flechas la mueven.',
  );
  side.setAttribute('role', 'complementary');
  side.setAttribute('aria-label', 'Panel lateral');

  const main = document.createElement('main');
  main.className = 'app-main';
  main.append(view.element, side);
  const header = document.createElement('header');
  header.append(heading, toolbar.element);
  root.replaceChildren(skip, header, main, createAnnouncer(editor).element);

  attachPointerInput(editor, view.stage);
  attachWheelInput(editor, view.stage);
  attachInlineEdit(editor, view.stage);
  attachDoubleTap(view.stage);
  attachKeyboardShortcuts(editor);
  attachPrint(editor);
}
