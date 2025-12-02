import { memo } from 'preact/compat';
import type { PlaceHistory } from '../types';
import { ChessBoardLabelsRow } from '../const';

interface HistoryItemProps extends Omit<PlaceHistory, 'timestamp'> {}

const HistoryItem = ({
  index,
  placedBy,
  piece,
  timeSpent,
}: HistoryItemProps) => {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{placedBy === 'llm' ? 'LLM' : '用户'}</td>
      <td>{piece.type === 'black' ? '黑子' : '白子'}</td>
      <td>{ChessBoardLabelsRow[piece.row]}{piece.column + 1}</td>
      <td>
        {timeSpent > 0 ? (
          `${Math.round(timeSpent * 1000) / 1000} 秒`
        ) : '无记录'}
      </td>
    </tr>
  );
};

export default memo(HistoryItem);
