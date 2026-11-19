import { createPieceRegistry, type DiscoveredPiece, type PieceRegistry } from './registry';
import type { PieceDefinition } from './types';

// Cada carpeta `src/pieces/<kind>/index.ts` que exporta su definición por defecto es una pieza.
const modules = import.meta.glob<{ default: PieceDefinition }>('./*/index.ts', { eager: true });

const FOLDER_PATTERN = /^\.\/([^/]+)\/index\.ts$/;

export function discoverPieces(): DiscoveredPiece[] {
  return Object.entries(modules).map(([path, module]) => ({
    folder: FOLDER_PATTERN.exec(path)?.[1] ?? path,
    definition: module.default,
  }));
}

export const pieces: PieceRegistry = createPieceRegistry(discoverPieces());
