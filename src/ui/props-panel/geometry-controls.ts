import type { Rect } from '../../core/geometry/rect';
import { numberField } from '../fields/form-fields';

const FIELDS = [
  { key: 'x', label: 'X (mm)' },
  { key: 'y', label: 'Y (mm)' },
  { key: 'w', label: 'Ancho (mm)' },
  { key: 'h', label: 'Alto (mm)' },
] as const;

const round2 = (v: number): number => Math.round(v * 100) / 100;

// Posición y tamaño de una pieza, en mm.
export function createGeometryControls(onChange: (rect: Rect) => void): {
  element: HTMLElement;
  set(rect: Rect): void;
} {
  const element = document.createElement('div');
  element.className = 'pp-section';
  const inputs = FIELDS.map((f) => {
    const { row, input } = numberField(f.label, -10000, 10000);
    element.append(row);
    return { key: f.key, input };
  });
  let current: Rect = { x: 0, y: 0, w: 1, h: 1 };

  for (const { key, input } of inputs) {
    input.addEventListener('change', () => {
      const value = Number(input.value.replace(',', '.'));
      if (Number.isFinite(value) && input.value.trim() !== '') {
        onChange({ ...current, [key]: round2(value) });
      } else input.value = String(current[key]);
    });
  }
  return {
    element,
    set(rect) {
      current = rect;
      for (const { key, input } of inputs) {
        if (document.activeElement !== input) input.value = String(round2(rect[key]));
      }
    },
  };
}
