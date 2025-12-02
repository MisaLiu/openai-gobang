import ChessBoard from '../ChessBoard/ChessBoard';
import HistoryBoard from '../HistoryBoard/HistoryBoard';
import ThoughtBoard from '../ThoughtBoard';

const GamePanel = () => {
  return (
    <>
      <ChessBoard />
      <hr />
      <HistoryBoard />
      <hr />
      <ThoughtBoard />
    </>
  )
};

export default GamePanel;
