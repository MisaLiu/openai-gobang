import { useState } from 'preact/hooks';
import ChessLabelRow from './LabelRow';
import ChessLabelColumn from './LabelColumn';
import ChessBlocks from './Blocks';
import ChessPieces from "./Pieces";
import './style.css';
import type { ChessPiece } from '../types';

interface ChessBoardProps {
  size?: number;
}

const ChessBoard = ({
  size = 15
}: ChessBoardProps) => {
  const [ pieceType, setPieceType ] = useState<'black' | 'white'>('black');
  const [ pieces, setPieces ] = useState<ChessPiece[]>([]);

  const handlePiecePlaced = (piece: ChessPiece) => {
    setPieces((e) => [ ...e, piece ]);

    if (piece.type === 'black') setPieceType('white');
    else setPieceType('black');
  }; 

  return (
    <div
      class="chessboard-container"
      style={{
        '--chessboard-size': size,
      }}
    >
      <ChessLabelRow size={size} />
      <ChessLabelColumn size={size} />
      <div class="chessboard-main">
        <ChessBlocks size={size} />
        <ChessPieces
          size={size}
          pieces={pieces}
          onPlace={handlePiecePlaced}
          placeType={pieceType}
        />
      </div>
    </div>
  );
};

export default ChessBoard;
