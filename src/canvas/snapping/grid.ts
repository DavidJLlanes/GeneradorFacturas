export const snapToGrid = (value: number, gridMm: number): number =>
  gridMm > 0 ? Math.round(value / gridMm) * gridMm : value;
