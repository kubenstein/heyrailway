import type { MouseEvent } from 'react';
import type { Point } from './types';

export const BOARD_CELL_SIZE = 30;
export const BOARD_SIZE = 50;

export function pointToBoardPoint(point: Point): Point {
  return {
    x: point.x * BOARD_CELL_SIZE + BOARD_CELL_SIZE / 2,
    y: point.y * BOARD_CELL_SIZE + BOARD_CELL_SIZE / 2,
  };
}

export function eToBoardPoint(e: MouseEvent<HTMLElement>): Point {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / BOARD_CELL_SIZE);
  const y = Math.floor((e.clientY - rect.top) / BOARD_CELL_SIZE);
  const point: Point = { x, y };
  return point;
}
