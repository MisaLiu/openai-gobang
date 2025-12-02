import ChessBoard from '../ChessBoard/ChessBoard';
import HistoryDrawer from '../HistoryDrawer/HistoryDrawer';

const GamePanel = () => {
  return (
    <>
      <ChessBoard />
      <hr />
      <HistoryDrawer />
    </>
  )
};

export default GamePanel;
