import ChessLabelRow from './LabelRow';
import ChessLabelColumn from './LabelColumn';
import ChessBlocks from './Blocks';
import ChessPieces from "./Pieces";
import './style.css';
import type { ChessPiece } from '../types';

interface ChessBoardProps {
  onPlaced: (piece: ChessPiece) => void;
  size?: number;
  placeType?: 'black' | 'white',
  pieces?: ChessPiece[],
  allowPlace?: boolean,
}

const ChessBoard = ({
  onPlaced,
  size = 15,
  placeType = 'black',
  pieces = [],
  allowPlace = true,
}: ChessBoardProps) => {
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
          onPlace={onPlaced}
          placeType={placeType}
          allowPlace={allowPlace}
        />
      </div>
    </div>
  );
};

export default ChessBoard;
