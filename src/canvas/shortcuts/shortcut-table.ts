import {
  clearSelection,
  deleteSelection,
  duplicateSelection,
  nudgeSelection,
  selectAll,
} from '../commands/element-commands';
import { toggleHideSelection, toggleLockSelection } from '../commands/flag-commands';
import { redo, undo } from '../commands/history-commands';
import { bringForward, bringToFront, sendBackward, sendToBack } from '../commands/order-commands';
import { zoomIn, zoomOut, zoomTo100, zoomToFit, zoomToSelection } from '../commands/view-commands';
import type { Editor } from '../editor/create-editor';

export interface Shortcut {
  /** Valores de `KeyboardEvent.key` (en minúsculas) que activan el atajo. */
  keys?: readonly string[];
  /** Valores de `KeyboardEvent.code`, para teclas que cambian con shift (como los dígitos). */
  codes?: readonly string[];
  /** Ctrl o ⌘. */
  mod?: boolean;
  /** Si se indica, shift debe coincidir; si no, se ignora. */
  shift?: boolean;
  run: (editor: Editor, e: KeyboardEvent) => void;
}

const nudge = (dx: number, dy: number) => (editor: Editor, e: KeyboardEvent) => {
  const step = e.shiftKey ? 10 : 1;
  nudgeSelection(editor, dx * step, dy * step);
};

export const SHORTCUTS: readonly Shortcut[] = [
  { keys: ['z'], mod: true, shift: false, run: undo },
  { keys: ['z'], mod: true, shift: true, run: redo },
  { keys: ['y'], mod: true, run: redo },
  { keys: ['delete', 'backspace'], run: deleteSelection },
  { keys: ['d'], mod: true, run: duplicateSelection },
  { keys: ['a'], mod: true, run: selectAll },
  { keys: ['escape'], run: clearSelection },
  { keys: ['arrowleft'], run: nudge(-1, 0) },
  { keys: ['arrowright'], run: nudge(1, 0) },
  { keys: ['arrowup'], run: nudge(0, -1) },
  { keys: ['arrowdown'], run: nudge(0, 1) },
  { keys: [']'], mod: true, run: bringToFront },
  { keys: [']'], run: bringForward },
  { keys: ['['], mod: true, run: sendToBack },
  { keys: ['['], run: sendBackward },
  { keys: ['l'], mod: true, shift: true, run: toggleLockSelection },
  { keys: ['h'], mod: true, shift: true, run: toggleHideSelection },
  { keys: ['+', '='], run: zoomIn },
  { keys: ['-', '_'], run: zoomOut },
  { codes: ['Digit1'], shift: true, run: zoomToFit },
  { codes: ['Digit0'], shift: true, run: zoomTo100 },
  { codes: ['Digit2'], shift: true, run: zoomToSelection },
];
