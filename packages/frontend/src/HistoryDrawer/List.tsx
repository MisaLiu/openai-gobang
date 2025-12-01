import { useEffect, useState } from 'preact/hooks';
import HistoryItem from './Item';
import HistoryStore from '../state/history';
import type { PlaceHistory } from '../types';

const HistoryList = () => {
  const [ histories, setHistories ] = useState<PlaceHistory[]>([]);
  const [ expandedThoughts, setExpandedThoughts ] = useState<number>(NaN);

  const handleThoughtExpand = (timestamp: number) => {
    setExpandedThoughts((e) => {
      if (e === timestamp) return NaN;
      else return timestamp;
    });
  }

  const updateHistories = () => {
    const { histories } = HistoryStore.getState();

    setHistories(histories);
    setExpandedThoughts(histories[0].timestamp);
  };

  useEffect(() => {
    return HistoryStore.subscribe(() => { updateHistories() });
  }, []);

  return (
    <div class="history-list">
      {histories.map((history) => (
        <HistoryItem
          {...history}
          isThoughtExpanded={history.timestamp === expandedThoughts}
          onExpand={handleThoughtExpand}
          key={`history-${history.timestamp}`}
        />
      ))}
    </div>
  );
};

export default HistoryList;
