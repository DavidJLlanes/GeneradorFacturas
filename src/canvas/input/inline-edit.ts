import { rectOf } from '../../core/document/element-rect';
import type { DocElement } from '../../core/document/types';
import { pieces } from '../../pieces/discover';
import { setProps } from '../commands/piece-commands';
import type { Editor } from '../editor/create-editor';
import { hitTestElement } from '../selection/hit-test';
import { rectToScreen, screenToPage } from '../viewport/viewport';
import { stagePoint } from './stage-point';

const PX_PER_PT = 96 / 72;

function openEditor(editor: Editor, stage: HTMLElement, el: DocElement, prop: string): void {
  const vp = editor.ui.get().viewport;
  const box = rectToScreen(vp, rectOf(el));
  const props = pieces.propsOf(el);

  const area = document.createElement('textarea');
  area.className = 'cv-inline';
  area.value = String(props[prop] ?? '');
  Object.assign(area.style, {
    left: `${box.x}px`,
    top: `${box.y}px`,
    width: `${Math.max(box.w, 40)}px`,
    height: `${Math.max(box.h, 24)}px`,
    fontSize: `${Number(props['fontSize'] ?? 11) * PX_PER_PT * vp.zoom}px`,
    textAlign: String(props['align'] ?? 'left'),
    color: String(props['color'] ?? 'inherit'),
    fontWeight: props['bold'] === true ? '700' : '400',
    fontStyle: props['italic'] === true ? 'italic' : 'normal',
  });

  let finished = false;
  const finish = (commit: boolean): void => {
    if (finished) return;
    finished = true;
    if (commit) setProps(editor, [el.id], { [prop]: area.value });
    area.remove();
  };
  area.addEventListener('blur', () => finish(true));
  area.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Escape') finish(false);
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) finish(true);
  });
  for (const type of ['pointerdown', 'dblclick', 'wheel']) {
    area.addEventListener(type, (e) => e.stopPropagation());
  }
  stage.append(area);
  area.focus();
  area.select();
}

// Doble clic sobre una pieza de texto: se edita directamente sobre la página.
// Enter inserta salto de línea; Ctrl+Enter o salir del cuadro guarda; Esc cancela.
export function attachInlineEdit(editor: Editor, stage: HTMLElement): () => void {
  const onDoubleClick = (e: MouseEvent): void => {
    if (editor.ui.get().fillMode) return;
    const point = screenToPage(editor.ui.get().viewport, stagePoint(stage, e));
    const el = hitTestElement(editor.doc(), point);
    const prop = el ? pieces.get(el.kind)?.inlineProp : undefined;
    if (!el || !prop) return;
    editor.select([el.id]);
    openEditor(editor, stage, el, prop);
  };
  stage.addEventListener('dblclick', onDoubleClick);
  return () => stage.removeEventListener('dblclick', onDoubleClick);
}
