import { setProps, setRect } from '../../canvas/commands/piece-commands';
import type { Editor } from '../../canvas/editor/create-editor';
import type { DocElement } from '../../core/document/types';
import { pieces } from '../../pieces/discover';
import { paletteOf } from '../../styles/palette';
import { createGeometryControls } from './geometry-controls';
import { createPropControl, type PropControl } from './props-controls';
import './props-panel.css';

const heading = (text: string): HTMLElement => {
  const h = document.createElement('h3');
  h.className = 'pp-heading';
  h.textContent = text;
  return h;
};

// Panel de propiedades: se genera a partir de las propiedades que declara la pieza seleccionada.
// Con varias piezas del mismo tipo, un cambio se aplica a todas.
export function createPropsPanel(editor: Editor): { element: HTMLElement; destroy(): void } {
  const root = document.createElement('aside');
  root.className = 'pp';
  const title = document.createElement('h2');
  title.className = 'lp-title';
  title.textContent = 'Propiedades';
  const body = document.createElement('div');
  body.className = 'pp-body';
  root.append(title, body);

  let structure = '';
  let controls: PropControl[] = [];
  let geometry: ReturnType<typeof createGeometryControls> | null = null;
  let selected: DocElement[] = [];

  const rebuild = (kind: string | null): void => {
    controls = [];
    geometry = null;
    const piece = kind ? pieces.get(kind) : undefined;
    if (selected.length === 0 || !piece) {
      const hint = document.createElement('p');
      hint.className = 'pp-hint';
      hint.textContent =
        selected.length === 0
          ? 'Selecciona una pieza para editarla.'
          : 'Las piezas seleccionadas son de distinto tipo.';
      body.replaceChildren(hint);
      return;
    }
    const nodes: HTMLElement[] = [
      heading(selected.length > 1 ? `${piece.name} (${selected.length})` : piece.name),
    ];
    const ids = (): string[] => selected.map((e) => e.id);
    for (const spec of piece.props) {
      const control = createPropControl(spec, () => paletteOf(editor.doc()));
      control.onChange((value) => setProps(editor, ids(), { [spec.key]: value }));
      controls.push(control);
      nodes.push(control.row);
    }
    if (selected.length === 1) {
      geometry = createGeometryControls((rect) => setRect(editor, selected[0]!.id, rect));
      nodes.push(heading('Posición y tamaño'), geometry.element);
    }
    body.replaceChildren(...nodes);
  };

  const render = (): void => {
    const ids = editor.ui.get().selection;
    selected = editor.doc().elements.filter((e) => ids.includes(e.id));
    const kinds = new Set(selected.map((e) => e.kind));
    const kind = kinds.size === 1 ? (selected[0]?.kind ?? null) : null;
    const key = `${selected.map((e) => e.id).join(',')}|${kind ?? ''}`;
    if (key !== structure) {
      structure = key;
      rebuild(kind);
    }
    const first = selected[0];
    if (!first) return;
    const props = pieces.propsOf(first);
    for (const c of controls) {
      if (document.activeElement !== c.input) c.set(props[c.key]);
    }
    geometry?.set({ x: first.x, y: first.y, w: first.w, h: first.h });
  };
  render();

  return { element: root, destroy: editor.onChange(render) };
}
