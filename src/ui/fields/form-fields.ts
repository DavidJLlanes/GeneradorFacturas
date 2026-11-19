// Constructores mínimos de campos de formulario para el diálogo de papel.

export interface Field<T extends HTMLElement> {
  row: HTMLElement;
  input: T;
}

// Opción de un desplegable (con createElement, que funciona igual en el navegador y en las pruebas).
export function option(label: string, value: string): HTMLOptionElement {
  const opt = document.createElement('option');
  opt.value = value;
  opt.textContent = label;
  return opt;
}

function wrap<T extends HTMLElement>(text: string, input: T): Field<T> {
  const row = document.createElement('label');
  row.className = 'pd-row';
  const span = document.createElement('span');
  span.textContent = text;
  row.append(span, input);
  return { row, input };
}

export function numberField(text: string, min: number, max: number): Field<HTMLInputElement> {
  const input = document.createElement('input');
  input.type = 'number';
  input.min = String(min);
  input.max = String(max);
  input.step = '0.1';
  input.inputMode = 'decimal';
  return wrap(text, input);
}

export function checkField(text: string): Field<HTMLInputElement> {
  const input = document.createElement('input');
  input.type = 'checkbox';
  const field = wrap(text, input);
  field.row.classList.add('pd-check');
  return field;
}

export function selectField(
  text: string,
  options: readonly { value: string; label: string; group?: string }[],
): Field<HTMLSelectElement> {
  const select = document.createElement('select');
  const groups = new Map<string, HTMLOptGroupElement>();
  for (const o of options) {
    const opt = option(o.label, o.value);
    let parent: HTMLElement = select;
    if (o.group) {
      let g = groups.get(o.group);
      if (!g) {
        g = document.createElement('optgroup');
        g.label = o.group;
        groups.set(o.group, g);
        select.append(g);
      }
      parent = g;
    }
    parent.append(opt);
  }
  return wrap(text, select);
}

export function colorField(text: string): Field<HTMLInputElement> {
  const input = document.createElement('input');
  input.type = 'color';
  return wrap(text, input);
}

export function textField(text: string): Field<HTMLInputElement> {
  const input = document.createElement('input');
  input.type = 'text';
  return wrap(text, input);
}

export function textareaField(text: string, rows = 3): Field<HTMLTextAreaElement> {
  const input = document.createElement('textarea');
  input.rows = rows;
  return wrap(text, input);
}

export function dateField(text: string): Field<HTMLInputElement> {
  const input = document.createElement('input');
  input.type = 'date';
  return wrap(text, input);
}
