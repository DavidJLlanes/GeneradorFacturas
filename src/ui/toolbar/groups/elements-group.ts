import { deleteSelection, duplicateSelection } from '../../../canvas/commands/element-commands';
import { toggleHideSelection, toggleLockSelection } from '../../../canvas/commands/flag-commands';
import type { ButtonGroup } from '../button-spec';
import { hasSelection } from '../enabled-rules';

export const elementsGroup: ButtonGroup = {
  id: 'elements',
  title: 'Elementos',
  buttons: [
    {
      id: 'duplicate',
      label: 'Duplicar',
      title: 'Duplicar (Ctrl+D)',
      run: duplicateSelection,
      enabled: hasSelection,
    },
    {
      id: 'delete',
      label: 'Eliminar',
      title: 'Eliminar (Supr)',
      run: deleteSelection,
      enabled: hasSelection,
    },
    {
      id: 'lock',
      label: 'Bloquear',
      title: 'Bloquear o desbloquear (Ctrl+Shift+L)',
      run: toggleLockSelection,
      enabled: hasSelection,
    },
    {
      id: 'hide',
      label: 'Ocultar',
      title: 'Ocultar (Ctrl+Shift+H); se vuelve a mostrar desde las capas',
      run: toggleHideSelection,
      enabled: hasSelection,
    },
  ],
};
