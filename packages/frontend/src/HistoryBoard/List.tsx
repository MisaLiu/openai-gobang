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
      {histories.map((history) => (
        <HistoryItem
          {...history}
          key={`history-${history.timestamp}`}
        />
      ))}
    </div>
  );
};

export default HistoryList;
