import type { ChessPiece, PieceArray } from './types';

export const findPiece = (pieceArr: PieceArray, row: number, column: number) => {
  const columnArr = pieceArr[row];
  if (!columnArr) return null;
  return columnArr[column] || null;
};

export const checkWin = (pieceArr: PieceArray, piece: ChessPiece) => {
  const { type, row, column } = piece;
  const _type = type === 'black' ? 1 : 2;
  const directions = [
    [ 1, 0 ],
    [ 0, 1 ],
    [ 1, 1 ],
    [ 1, -1 ]
  ];

  for (let [ dx, dy ] of directions) {
    let count = 1;

    let i = 1;
    while (
      (row + dx * i >= 0 && column + dy * i >= 0) &&
      pieceArr[row + dx * i] !== (void 0) &&
      pieceArr[row + dx * i][column + dy * i] === _type
    ) {
      count++;
      i++;
    }

    i = 1;
    while (
      (row - dx * i >= 0 && column - dy * i >= 0) &&
      pieceArr[row - dx * i] !== (void 0) &&
      pieceArr[row - dx * i][column - dy * i] === _type
    ) {
      count++;
      i++;
    }

    if (count >= 5) return true;
  }

  return false;
};
