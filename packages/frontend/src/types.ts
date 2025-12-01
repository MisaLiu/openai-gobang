
export interface Point {
  x: number;
  y: number;
};

export interface ChessPiece {
  type: 'black' | 'white';
  row: number,
  column: number,
};
