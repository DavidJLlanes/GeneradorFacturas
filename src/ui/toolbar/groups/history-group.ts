import { redo, undo } from '../../../canvas/commands/history-commands';
import type { ButtonGroup } from '../button-spec';

export const historyGroup: ButtonGroup = {
  id: 'history',
  title: 'Historial',
  buttons: [
    {
      id: 'undo',
      label: '↶',
      title: 'Deshacer (Ctrl+Z)',
      run: undo,
      enabled: (e) => e.history.canUndo,
    },
    {
      id: 'redo',
      label: '↷',
      title: 'Rehacer (Ctrl+Shift+Z)',
      run: redo,
      enabled: (e) => e.history.canRedo,
    },
  ],
};
