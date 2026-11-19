import type { ButtonGroup } from '../button-spec';
import { alignGroup } from './align-group';
import { dataGroup } from './data-group';
import { elementsGroup } from './elements-group';
import { historyGroup } from './history-group';
import { insertGroup } from './insert-group';
import { orderGroup } from './order-group';
import { paperGroup } from './paper-group';
import { snapGroup } from './snap-group';
import { viewGroup } from './view-group';

export const TOOLBAR_GROUPS: readonly ButtonGroup[] = [
  historyGroup,
  insertGroup,
  elementsGroup,
  orderGroup,
  alignGroup,
  viewGroup,
  paperGroup,
  dataGroup,
  snapGroup,
];
