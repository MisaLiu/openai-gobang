import { useEffect, useState } from 'preact/hooks';
import HistoryItem from './Item';
import GameStore from '../state/game';
import type { PlaceHistory } from '../types';

const HistoryList = () => {
  const [ histories, setHistories ] = useState<PlaceHistory[]>([]);

  useEffect(() => {
    return GameStore.subscribe((s, p) => {
      if (s.histories !== p.histories) setHistories(s.histories);
    });
  }, []);

  return (
    <div class="history-list">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>棋手</th>
            <th>执黑/执白</th>
            <th>落子位置</th>
            <th>消耗时间</th>
          </tr>
        </thead>
        <tbody>
          {histories.map((history) => (
            <HistoryItem
              {...history}
              key={`history-${history.timestamp}`}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryList;
