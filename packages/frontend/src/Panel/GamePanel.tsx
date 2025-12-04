import ChessBoard from '../ChessBoard/ChessBoard';
import HistoryBoard from '../HistoryBoard/HistoryBoard';
import ThoughtBoard from '../ThoughtBoard';

const GamePanel = () => {
  return (
    <>
      <ChessBoard />
      <HistoryBoard />
      <hr />
      <ThoughtBoard />
    </>
  )
};

export default GamePanel;
