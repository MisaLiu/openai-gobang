import { useState, useRef, useEffect } from 'preact/hooks';
import ThoughtStore from './state/thought';

const Thought = () => {
  const lastUpdateRef = useRef(0);
  const [ thought, setThought ] = useState<string | null>(null);

  useEffect(() => {
    return ThoughtStore.subscribe((s) => {
      const currentTime = performance.now();
      if (currentTime - lastUpdateRef.current < 100) return;

      setThought(s.thought);
      lastUpdateRef.current = currentTime;
    });
  }, []);

  return (
    <>
      <h2>LLM 的思考</h2>
      <div class="thought-container">
        {!thought ? (
          '该模型貌似不支持此功能'
        ) : thought}
      </div>
    </>
  )
};

export default Thought;
