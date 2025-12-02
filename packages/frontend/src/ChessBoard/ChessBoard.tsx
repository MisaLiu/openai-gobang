import ChessLabelRow from './LabelRow';
import ChessLabelColumn from './LabelColumn';
import ChessBlocks from './Blocks';
import ChessPieces from "./Pieces";
import ChessBoardOverlay from './Overlay';
import SettingsStore from '../state/settings';
import './style.css';

const ChessBoard = () => {
  const size = SettingsStore.getState().boardSize;

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
      <ChessBoardOverlay />
    </div>
  );
};

export default ChessBoard;
