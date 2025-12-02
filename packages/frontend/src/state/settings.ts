import { createStore } from 'zustand';

interface ISettingsStore {
  difficulty: 0 | 1 | 2 | 3,
  boardSize: number,
  llmFirst: boolean,
}

const SettingsStore = createStore<ISettingsStore>(() => ({
  difficulty: 1,
  boardSize: 15,
  llmFirst: false,
}));

export const setDifficulty = (difficulty: 0 | 1 | 2 | 3) => {
  SettingsStore.setState({
    difficulty,
  });
};

export const setBoardSize = (size: number) => {
  SettingsStore.setState({
    boardSize: size,
  });
};

export const setLLMFirst = (llmFirst: boolean) => {
  SettingsStore.setState({
    llmFirst,
  });
};

export default SettingsStore;
