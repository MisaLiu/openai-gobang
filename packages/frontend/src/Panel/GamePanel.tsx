import ChessBoard from '../ChessBoard/ChessBoard';
import HistoryDrawer from '../HistoryDrawer/HistoryDrawer';
import ThoughtBoard from '../ThoughtBoard';

const GamePanel = () => {
  return (
    <>
      <ChessBoard />
      <hr />
      <HistoryDrawer />
      <hr />
      <ThoughtBoard />
    </>
  )
};

export default GamePanel;
