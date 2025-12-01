import { createStore } from 'zustand';
import type { PlaceHistory } from '../types';

interface IHistoryStore {
  histories: PlaceHistory[],

  addHistory: (history: PlaceHistory) => void,
  getLatestHistory: () => PlaceHistory | undefined,
  editLatestHistory: (history: Partial<PlaceHistory>) => void,
};

const HistoryStore = createStore<IHistoryStore>((set, get) => ({
  histories: [],

  addHistory: (history: PlaceHistory) => set(() => ({
    histories: [ history, ...get().histories ],
  })),

  getLatestHistory: () => {
    const histories = get().histories;
    return histories[0];
  },

  editLatestHistory: (history: Partial<PlaceHistory>) => set(() => {
    const histories = get().histories;
    const latestHistory = histories[0];
    if (!latestHistory) return {};

    Object.assign(latestHistory, history);
    return {
      histories: [ ...histories ],
    };
  }),
}));

export default HistoryStore;
