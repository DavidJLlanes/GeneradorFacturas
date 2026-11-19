import type { PieceProps } from '../../core/document/types';

// Lectura segura de propiedades ya completadas con sus valores por defecto.
export const str = (props: PieceProps, key: string): string => String(props[key] ?? '');
export const num = (props: PieceProps, key: string): number => Number(props[key] ?? 0) || 0;
export const bool = (props: PieceProps, key: string): boolean => props[key] === true;
