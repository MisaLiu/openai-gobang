import { useState, useEffect } from 'preact/hooks';
import ChessLabelRow from './LabelRow';
import ChessLabelColumn from './LabelColumn';
import ChessBlocks from './Blocks';
import ChessPieces from "./Pieces";
import ChessBoardOverlay from './Overlay';
import SettingsStore from '../state/settings';
import GameStore from '../state/game';
import './style.css';

const ChessBoard = () => {
  const size = SettingsStore.getState().boardSize;
  const [ isFinished, setIsFinished ] = useState<boolean>(false);

  useEffect(() => {
    return GameStore.subscribe((s, p) => {
      if (s.result !== p.result) setIsFinished(s.result !== null);
    });
  }, []);

  return (
    <div
      class={`chessboard-container ${isFinished ? 'finished' : ''}`}
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
      <ChessBoardOverlay />
    </div>
  );
};

export default ChessBoard;
