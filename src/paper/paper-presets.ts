// Catálogo de papeles. Las medidas están en vertical (ancho ≤ alto), en milímetros.

export type PaperGroup = 'sheet' | 'ticket' | 'other';

export interface PaperPreset {
  id: string;
  name: string;
  group: PaperGroup;
  widthMm: number;
  heightMm: number;
  /** Largo continuo (rollos de ticket): el ancho es fijo y el alto se ajusta al contenido. */
  continuous?: boolean;
}

export const PAPER_PRESETS: readonly PaperPreset[] = [
  { id: 'a3', name: 'A3', group: 'sheet', widthMm: 297, heightMm: 420 },
  { id: 'a4', name: 'A4', group: 'sheet', widthMm: 210, heightMm: 297 },
  { id: 'a5', name: 'A5', group: 'sheet', widthMm: 148, heightMm: 210 },
  { id: 'a6', name: 'A6', group: 'sheet', widthMm: 105, heightMm: 148 },
  { id: 'letter', name: 'Carta (US Letter)', group: 'sheet', widthMm: 215.9, heightMm: 279.4 },
  { id: 'legal', name: 'Legal (US Legal)', group: 'sheet', widthMm: 215.9, heightMm: 355.6 },
  {
    id: 'ticket-80',
    name: 'Ticket 80 mm',
    group: 'ticket',
    widthMm: 80,
    heightMm: 200,
    continuous: true,
  },
  {
    id: 'ticket-58',
    name: 'Ticket 58 mm',
    group: 'ticket',
    widthMm: 58,
    heightMm: 200,
    continuous: true,
  },
  { id: 'square', name: 'Cuadrado', group: 'other', widthMm: 200, heightMm: 200 },
];

export const DEFAULT_PRESET_ID = 'a4';

export const GROUP_NAMES: Record<PaperGroup, string> = {
  sheet: 'Hojas',
  ticket: 'Tickets (largo continuo)',
  other: 'Otros',
};

export const presetById = (id: string): PaperPreset | undefined =>
  PAPER_PRESETS.find((p) => p.id === id);
