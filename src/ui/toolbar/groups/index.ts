import type { ButtonGroup } from '../button-spec';
import { alignGroup } from './align-group';
import { elementsGroup } from './elements-group';
import { historyGroup } from './history-group';
import { orderGroup } from './order-group';
import { snapGroup } from './snap-group';
import { viewGroup } from './view-group';

export const TOOLBAR_GROUPS: readonly ButtonGroup[] = [
  historyGroup,
  elementsGroup,
  orderGroup,
  alignGroup,
  viewGroup,
  snapGroup,
];
