import type { Editor } from '../../canvas/editor/create-editor';

export interface ButtonSpec {
  id: string;
  label: string | ((editor: Editor) => string);
  title: string;
  run: (editor: Editor) => void;
  enabled?: (editor: Editor) => boolean;
  pressed?: (editor: Editor) => boolean;
}

export interface ButtonGroup {
  id: string;
  title: string;
  buttons: readonly ButtonSpec[];
}
