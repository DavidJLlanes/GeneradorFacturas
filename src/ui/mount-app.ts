import type { Editor } from '../canvas/editor/create-editor';
import { attachPointerInput } from '../canvas/input/pointer-input';
import { attachInlineEdit } from '../canvas/input/inline-edit';
import { attachWheelInput } from '../canvas/input/wheel-input';
import { createCanvasView } from '../canvas/render/create-canvas-view';
import { attachKeyboardShortcuts } from '../canvas/shortcuts/keyboard-shortcuts';
import { createDataPanel } from './data-panel/data-panel';
import { createLayersPanel } from './layers-panel/layers-panel';
import { createPropsPanel } from './props-panel/props-panel';
import { createSideTabs } from './side-tabs/side-tabs';
import { createToolbar } from './toolbar/toolbar';
import './app-layout.css';

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

  const main = document.createElement('div');
  main.className = 'app-main';
  main.append(view.element, side);
  root.replaceChildren(toolbar.element, main);

  attachPointerInput(editor, view.stage);
  attachWheelInput(editor, view.stage);
  attachInlineEdit(editor, view.stage);
  attachKeyboardShortcuts(editor);
}
