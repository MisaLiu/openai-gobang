import { useState, useEffect } from 'preact/hooks';
import ChessLabelRow from './LabelRow';
import ChessLabelColumn from './LabelColumn';
import ChessBlocks from './Blocks';
import ChessPieces from "./Pieces";
import SettingsStore from '../state/settings';
import './style.css';

const ChessBoard = () => {
  const [ size, setSize ] = useState<number>(15);

  useEffect(() => {
    return SettingsStore.subscribe((s, p) => {
      if (s.boardSize !== p.boardSize) setSize(s.boardSize);
    });
  }, []);

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
        />
      </div>
    </div>
  );
};

export default ChessBoard;
