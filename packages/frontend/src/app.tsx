import { useState } from 'preact/hooks'
import ChessBoard from './ChessBoard/ChessBoard'
import { placePiece, startChess } from './api'
import type { ChessPiece } from './types'
import './app.css'

export function App() {
  const [ gameStarted, setGameStarted ] = useState(false);
  const [ allowPlace, setAllowPlace ] = useState(false);
  const [ pieces, setPieces ] = useState<ChessPiece[]>([]);

  const handleStart = () => {
    startChess()
      .then((result) => {
        console.log(result);
        setGameStarted(true);
        setAllowPlace(true);
      });
  };

  const handlePiecePlaced = (piece: ChessPiece) => {
    setPieces(e => [ ...e, piece ]);
    setAllowPlace(false);

    placePiece(piece)
      .then((e) => {
        console.log(e);
        if (e.data.piece) {
          setPieces(i => [ ...i, e.data.piece ]);
        }
        setAllowPlace(true);
      });
  };

  return (
    <>
      {!gameStarted && (
        <button onClick={handleStart}>Start</button>
      )}
      <ChessBoard
        pieces={pieces}
        onPlaced={handlePiecePlaced}
        allowPlace={gameStarted && allowPlace}
        placeType='black'
      />
    </>
  )
}
