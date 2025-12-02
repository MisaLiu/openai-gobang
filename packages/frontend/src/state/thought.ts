import { createStore } from 'zustand';

interface IThoughtStore {
  thought: string | null;
}

const ThoughtStore = createStore<IThoughtStore>(() => ({
  thought: null,
}));

export const appendThought = (stream: string) => {
  const { thought: _thought } = ThoughtStore.getState();
  ThoughtStore.setState({
    thought: _thought + stream,
  });
};

export const clearThought = () => {
  ThoughtStore.setState({
    thought: '',
  });
};

export const removeThought = () => {
  ThoughtStore.setState({
    thought: null,
  });
};

export default ThoughtStore;
