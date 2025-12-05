import { useState, useRef, useEffect } from 'preact/hooks';
import GameStore from './state/game';
import SettingsStore, { setAutoScroll } from './state/settings';
import ThoughtStore from './state/thought';
import type { TargetedInputEvent } from 'preact';

const Thought = () => {
  const lastUpdateRef = useRef(0);
  const [ thought, setThought ] = useState<string | null>(null);

  const updateThought = () => {
    setThought(ThoughtStore.getState().thought);
  };

  const updateAutoCheck = (e: TargetedInputEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    setAutoScroll(target.checked);
  };

  const scrollToTop = (toBottom?: boolean) => {
    if (!SettingsStore.getState().autoScroll) return;

    if (typeof toBottom === 'boolean' && toBottom) window.scrollTo(0, window.document.body.scrollHeight + 100);
    else window.scrollTo(0, 0);
  };

  useEffect(() => {
    const { ws } = GameStore.getState();
    if (ws) {
      ws.on('place', updateThought);
      ws.on('place', scrollToTop);
    }

    const unsubThought = ThoughtStore.subscribe(() => {
      const currentTime = performance.now();
      if (currentTime - lastUpdateRef.current < 100) return;

      updateThought();
      lastUpdateRef.current = currentTime;
      scrollToTop(true);
    });

    return (() => {
      if (ws) {
        ws.off('place', updateThought);
        ws.off('place', scrollToTop);
      }
      unsubThought();
    });
  }, []);

  return (
    <>
      <h2>LLM 的思考</h2>
      <label>
        <input type="checkbox" onInput={updateAutoCheck} />
        自动滚动
      </label>
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
