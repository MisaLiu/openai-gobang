import { useState, useEffect } from 'preact/hooks';
import GameStore from '../state/game';

const ChessBoardOverlay = () => {
  const [ llmThinking, setLLMThinking ] = useState<boolean>(!GameStore.getState().allowPlace);

  const updateLLMThinking = () => {
    const { allowPlace, result } = GameStore.getState();
    setLLMThinking(!allowPlace && result === null);
  };

  useEffect(() => {
    return GameStore.subscribe((s, p) => {
      if (s.allowPlace !== p.allowPlace) updateLLMThinking();
      if (s.result !== p.result) updateLLMThinking();
    });
  }, []);

  return (
    <div class={`chessboard-overlay ${llmThinking ? 'show' : ''}`}>
      <span>LLM 正在思考中...</span>
    </div>
  );
};

export default ChessBoardOverlay;
