import { setDataValue } from '../../canvas/commands/data-commands';
import type { Editor } from '../../canvas/editor/create-editor';
import type { DataSchema } from '../../core/document-type/types';
import { createDataControl, type DataControl } from './data-controls';
import './data-panel.css';

function buildForm(
  editor: Editor,
  schema: DataSchema,
): { nodes: HTMLElement[]; controls: DataControl[] } {
  const nodes: HTMLElement[] = [];
  const controls: DataControl[] = [];
  const groups = new Map<string, HTMLElement>();
  for (const field of schema.fields) {
    const control = createDataControl(field);
    if (!control) continue;
    let section = groups.get(field.group);
    if (!section) {
      section = document.createElement('section');
      section.className = 'dp-group';
      const title = document.createElement('h3');
      title.className = 'pp-heading';
      title.textContent = field.group;
      section.append(title);
      groups.set(field.group, section);
      nodes.push(section);
    }
    control.onChange((value) => setDataValue(editor, field.key, value));
    section.append(control.row);
    controls.push(control);
  }
  return { nodes, controls };
}

// Panel de datos: se genera a partir del esquema del tipo de documento.
export function createDataPanel(editor: Editor): { element: HTMLElement; destroy(): void } {
  const root = document.createElement('aside');
  root.className = 'pp dp';
  const body = document.createElement('div');
  body.className = 'pp-body';
  root.append(body);

  let schema: DataSchema | null | undefined;
  let controls: DataControl[] = [];

  const render = (): void => {
    const ui = editor.ui.get();
    if (ui.schema !== schema) {
      schema = ui.schema;
      if (!schema) {
        const hint = document.createElement('p');
        hint.className = 'pp-hint';
        hint.textContent = 'Este documento no tiene datos.';
        body.replaceChildren(hint);
        controls = [];
      } else {
        const form = buildForm(editor, schema);
        controls = form.controls;
        body.replaceChildren(...form.nodes);
      }
    }
    for (const c of controls) {
      if (document.activeElement !== c.input) c.set(ui.data[c.key]);
    }
  };
  render();

  return { element: root, destroy: editor.onChange(render) };
}
