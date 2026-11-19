import { insertPiece } from '../../../canvas/commands/piece-commands';
import { pieces } from '../../../pieces/discover';
import type { ButtonGroup } from '../button-spec';

// Un botón por pieza descubierta: añadir una pieza nueva no obliga a tocar la barra.
export const insertGroup: ButtonGroup = {
  id: 'insert',
  title: 'Insertar',
  buttons: pieces.list().map((piece) => ({
    id: `insert-${piece.kind}`,
    label: `+ ${piece.name}`,
    title: `Insertar: ${piece.name}`,
    run: (editor) => insertPiece(editor, piece),
  })),
};
