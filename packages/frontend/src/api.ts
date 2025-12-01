import type { ChessPiece } from './types';

export const startChess = (
  difficulty: 0 | 1 | 2 | 3 = 1,
  size: number = 15
) => (
  fetch(
    './api/chess/new',
    {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        difficulty, size,
      }),
    }
  ).then(e => e.json())
);

export const placePiece = (piece: ChessPiece) => (
  fetch(
    './api/chess/place',
    {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(piece),
    }
  ).then(e => e.json())
);
