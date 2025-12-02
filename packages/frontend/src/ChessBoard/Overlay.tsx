import { useState, useEffect } from 'preact/hooks';
import GameStore from '../state/game';

const ChessBoardOverlay = () => {
  const [ llmThinking, setLLMThinking ] = useState<boolean>(!GameStore.getState().allowPlace);

  useEffect(() => {
    return GameStore.subscribe((s, p) => {
      if (s.allowPlace !== p.allowPlace) setLLMThinking(!s.allowPlace);
    });
  }, []);

  return (
    <div class={`chessboard-overlay ${llmThinking ? 'show' : ''}`}>
      <span>LLM 正在思考中...</span>
    </div>
  );
};

export default ChessBoardOverlay;
