import { useState, useRef, useEffect } from 'preact/hooks';
import GameStore from './state/game';
import ThoughtStore from './state/thought';

const Thought = () => {
  const lastUpdateRef = useRef(0);
  const [ thought, setThought ] = useState<string | null>(null);

  const updateThought = () => {
    setThought(ThoughtStore.getState().thought);
  };

  useEffect(() => {
    const { ws } = GameStore.getState();
    if (ws) {
      ws.on('place', updateThought);
    }

    const unsubThought = ThoughtStore.subscribe(() => {
      const currentTime = performance.now();
      if (currentTime - lastUpdateRef.current < 100) return;

      updateThought();
      lastUpdateRef.current = currentTime;
    });

    return (() => {
      if (ws) ws.off('place', updateThought);
      unsubThought();
    });
  }, []);

  return (
    <>
      <h2>LLM 的思考</h2>
      <div class="thought-container">
        <pre>
          <code>
            {!thought ? (
              '该模型貌似不支持此功能'
            ) : thought}
          </code>
        </pre>
      </div>
    </>
  )
};

export default Thought;
