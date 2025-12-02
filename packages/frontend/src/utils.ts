import type { PieceArray } from './types';

export const findPiece = (pieceArr: PieceArray, row: number, column: number) => {
  const columnArr = pieceArr[row];
  if (!columnArr) return null;
  return columnArr[column] || null;
};
