import type { DocElement, PieceProps } from '../core/document/types';
import type { PieceDefinition } from './types';
import { validatePiece } from './validate';

export interface PieceRegistry {
  list(): readonly PieceDefinition[];
  get(kind: string): PieceDefinition | undefined;
  /** Propiedades de un elemento completadas con los valores por defecto de su pieza. */
  propsOf(element: DocElement): PieceProps;
}

export interface DiscoveredPiece {
  folder: string;
  definition: PieceDefinition;
}

export function createPieceRegistry(found: readonly DiscoveredPiece[]): PieceRegistry {
  const byKind = new Map<string, PieceDefinition>();
  for (const { folder, definition } of found) {
    const errors = validatePiece(definition, folder);
    if (errors.length > 0)
      throw new Error(`Pieza "${folder}" no válida:\n- ${errors.join('\n- ')}`);
    if (byKind.has(definition.kind)) throw new Error(`Pieza repetida: "${definition.kind}"`);
    byKind.set(definition.kind, definition);
  }
  const list = [...byKind.values()];
  return {
    list: () => list,
    get: (kind) => byKind.get(kind),
    propsOf: (el) => ({ ...byKind.get(el.kind)?.defaultProps, ...el.props }),
  };
}
