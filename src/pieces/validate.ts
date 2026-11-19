import type { PieceDefinition, PropKind } from './types';

const KIND_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const valueType: Record<PropKind, 'string' | 'number' | 'boolean'> = {
  text: 'string',
  multiline: 'string',
  number: 'number',
  color: 'string',
  select: 'string',
  toggle: 'boolean',
  image: 'string',
};

// Comprueba que una pieza cumple el contrato. Devuelve los problemas (vacío = válida).
export function validatePiece(def: PieceDefinition, folder: string): string[] {
  const errors: string[] = [];
  if (!KIND_PATTERN.test(def.kind)) errors.push(`kind inválido: "${def.kind}"`);
  if (def.kind !== folder)
    errors.push(`el kind "${def.kind}" no coincide con la carpeta "${folder}"`);
  if (!def.name.trim()) errors.push('falta el nombre');
  if (!(def.defaultSize.w > 0 && def.defaultSize.h > 0)) errors.push('tamaño por defecto inválido');

  const keys = def.props.map((p) => p.key);
  for (const key of new Set(keys.filter((k, i) => keys.indexOf(k) !== i))) {
    errors.push(`propiedad repetida: "${key}"`);
  }
  for (const spec of def.props) {
    if (!spec.label.trim()) errors.push(`la propiedad "${spec.key}" necesita etiqueta`);
    if (spec.kind === 'select' && !(spec.options && spec.options.length > 0)) {
      errors.push(`la propiedad "${spec.key}" es de lista y no tiene opciones`);
    }
    if (spec.min !== undefined && spec.max !== undefined && spec.min > spec.max) {
      errors.push(`la propiedad "${spec.key}" tiene min mayor que max`);
    }
    const value = def.defaultProps[spec.key];
    if (value === undefined) errors.push(`falta el valor por defecto de "${spec.key}"`);
    else if (typeof value !== valueType[spec.kind]) {
      errors.push(`el valor por defecto de "${spec.key}" debe ser ${valueType[spec.kind]}`);
    } else if (spec.kind === 'select' && !spec.options?.some((o) => o.value === value)) {
      errors.push(`el valor por defecto de "${spec.key}" no está en sus opciones`);
    }
  }
  for (const key of Object.keys(def.defaultProps)) {
    if (!keys.includes(key)) errors.push(`valor por defecto sin propiedad: "${key}"`);
  }
  return errors;
}
