import { pxToMm } from '../../core/units/units';

export interface SnapPreferences {
  gridMm: number;
  snapGrid: boolean;
  snapGuides: boolean;
}

export interface SnapSettings extends SnapPreferences {
  thresholdMm: number;
}

// Distancia en pantalla a la que las guías "atraen", sea cual sea el zoom.
export const SNAP_THRESHOLD_PX = 6;

export function toSnapSettings(prefs: SnapPreferences, zoom: number): SnapSettings {
  return { ...prefs, thresholdMm: pxToMm(SNAP_THRESHOLD_PX / zoom) };
}
