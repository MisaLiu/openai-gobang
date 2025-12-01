import { ChessBoardLabelsRow } from '../const';
import type { ChessPiece } from '../types';

const StringParseReg = /(black|white):([A-Z])([\d]{1,2})/;

export const parseString = (string: string): ChessPiece | null => {
  const match = string.match(StringParseReg);
  if (!match) return null;

  const [, type, row, column ] = match;

  const rowId = ChessBoardLabelsRow.findIndex(e => e === row);
  if (rowId === -1) return null;

  return {
    type: type as 'black' | 'white',
    row: rowId,
    column: parseInt(column) - 1,
  }
};

export const buildString = (piece: ChessPiece): string => {
  const rowLabel = ChessBoardLabelsRow[piece.row];
  if (!rowLabel) throw new Error('Invalid row index');

  return `${piece.type}:${rowLabel}${piece.column + 1}`;
};
