import { memo } from 'preact/compat';
import type { PlaceHistory } from '../types';
import { ChessBoardLabelsRow } from '../const';

interface HistoryItemProps extends PlaceHistory {
  isThoughtExpanded: boolean,
  onExpand: (timestamp: number) => void;
}

const HistoryItem = ({
  placedBy,
  timestamp,
  isThoughtExpanded,
  onExpand,
  piece,
  thoughts,
  timeSpent,
}: HistoryItemProps) => {
  return (
    <div class="history-list-item">
      <div class="history-list-item-header">
        <div class="history-placedBy">{placedBy === 'llm' ? 'LLM' : '用户'}</div>
        {timeSpent && (
          <div class="history-time-spent">耗时 {Math.round(timeSpent * 1000) / 1000} 秒</div>
        )}
      </div>
      {piece && (
        <div class="history-pieces">
          位于「{ChessBoardLabelsRow[piece.row]}{piece.column + 1}」
          （{piece.type === 'black' ? '黑子' : '白子'}）
        </div>
      )}
      {thoughts && (
        <div class="history-thoughts">
          <div
            class="history-thoughts-title"
            onClick={() => onExpand(timestamp)}
          >我的想法...</div>
          {isThoughtExpanded && (
            <div class="history-thoughts-content">{thoughts}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(HistoryItem);
