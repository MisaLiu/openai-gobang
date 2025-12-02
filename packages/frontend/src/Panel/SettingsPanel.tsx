import { setDifficulty, setBoardSize, setLLMFirst } from '../state/settings';
import { startGame } from '../state/game';
import type { TargetedInputEvent } from 'preact';

const SettingsPanel = () => {
  const updateDifficulty = (e: TargetedInputEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement | undefined;
    if (!target) return;
    setDifficulty(parseInt(target.value) as 0 | 1 | 2 | 3);
  };

  const updateBoardSize = (e: TargetedInputEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement | undefined;
    if (!target) return;
    setBoardSize(parseInt(target.value));
  };

  const updateFirstMove = (e: TargetedInputEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement | undefined;
    if (!target) return;
    setLLMFirst(target.value == 'true');
  };

  return (
    <>
      <h2>LLM 五子棋</h2>
      <hr />

      <h3>难度</h3>
      <blockquote>
        注：仅影响提示词生成，最终难度解释权由 LLM 所有。
      </blockquote>
      <form class="settings-radio-group difficulty" onInput={updateDifficulty}>
        <label>
          <input type="radio" value={0} name="difficulty" />
          简单
        </label>
        <label>
          <input type="radio" value={1} name="difficulty" checked />
          中等
        </label>
        <label>
          <input type="radio" value={2} name="difficulty" />
          困难
        </label>
        <label>
          <input type="radio" value={3} name="difficulty" />
          专家
        </label>
      </form>

      <h3>棋盘大小</h3>
      <form class="settings-radio-group board-size" onInput={updateBoardSize}>
        <label>
          <input type="radio" value={15} name="boardSize" checked />
          15*15
        </label>
        <label>
          <input type="radio" value={19} name="boardSize" />
          19*19
        </label>
      </form>

      <h3>谁执黑先手？</h3>
      <form class="settings-radio-group first-move" onInput={updateFirstMove}>
        <label>
          <input type="radio" value='false' name="firstMove" checked />
          您执黑先手
        </label>
        <label>
          <input type="radio" value='true' name="firstMove" />
          LLM 执黑先手
        </label>
      </form>

      <hr />
      <button onClick={startGame}>开始游戏！</button>
    </>
  )
};

export default SettingsPanel;
