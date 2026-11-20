import type { Mapping } from '../../batch/targets/auto-map';
import type { Target } from '../../batch/targets/build-targets';
import { option } from '../fields/form-fields';

// Tabla «destino ← columna del CSV»: una fila por campo del tipo de documento.
export function createMappingSection(onChange: () => void): {
  element: HTMLElement;
  show(targets: readonly Target[], headers: readonly string[], mapping: Mapping): void;
  mapping(): Mapping;
} {
  const element = document.createElement('div');
  element.className = 'bt-map';
  const selects = new Map<string, HTMLSelectElement>();

  return {
    element,
    show(targets, headers, mapping) {
      selects.clear();
      const rows: HTMLElement[] = [];
      let group = '';
      for (const target of targets) {
        if (target.group !== group) {
          group = target.group;
          const title = document.createElement('div');
          title.className = 'bt-group';
          title.textContent = group;
          rows.push(title);
        }
        const row = document.createElement('label');
        row.className = 'bt-row';
        const name = document.createElement('span');
        name.textContent = target.required ? `${target.label} *` : target.label;
        const select = document.createElement('select');
        select.append(option('— sin asignar —', '-1'));
        headers.forEach((h, i) => select.append(option(h || `Columna ${i + 1}`, String(i))));
        select.value = String(mapping[target.id] ?? -1);
        select.addEventListener('change', onChange);
        selects.set(target.id, select);
        row.append(name, select);
        rows.push(row);
      }
      element.replaceChildren(...rows);
    },
    mapping() {
      const result: Record<string, number> = {};
      for (const [id, select] of selects) {
        const index = Number(select.value);
        if (index >= 0) result[id] = index;
      }
      return result;
    },
  };
}
