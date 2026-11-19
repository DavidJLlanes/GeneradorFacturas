import type { Rect } from '../geometry/rect';
import type { DocElement } from './types';

export const rectOf = (e: DocElement): Rect => ({ x: e.x, y: e.y, w: e.w, h: e.h });
