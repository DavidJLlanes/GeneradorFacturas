import type { Editor } from '../canvas/editor/create-editor';
import { attachPointerInput } from '../canvas/input/pointer-input';
import { attachWheelInput } from '../canvas/input/wheel-input';
import { createCanvasView } from '../canvas/render/create-canvas-view';
import { attachKeyboardShortcuts } from '../canvas/shortcuts/keyboard-shortcuts';
import { createLayersPanel } from './layers-panel/layers-panel';
import { createToolbar } from './toolbar/toolbar';
import './app-layout.css';

// Monta la aplicación completa en `root`.
export function mountApp(root: HTMLElement, editor: Editor): void {
  root.className = 'app';

  const toolbar = createToolbar(editor);
  const view = createCanvasView(editor);
  const layers = createLayersPanel(editor);

  const main = document.createElement('div');
  main.className = 'app-main';
  main.append(view.element, layers.element);
  root.replaceChildren(toolbar.element, main);

  attachPointerInput(editor, view.stage);
  attachWheelInput(editor, view.stage);
  attachKeyboardShortcuts(editor);
}
