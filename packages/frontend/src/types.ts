
export interface Point {
  x: number;
  y: number;
};

export interface ChessPiece {
  type: 'black' | 'white';
  row: number,
  column: number,
};

export interface PlaceHistory {
  placedBy: 'user'| 'llm',
  timestamp: number,
  piece: ChessPiece,
  timeSpent: number,
};

export type PieceArray = Array<(1 | 2 | undefined)[]>;
