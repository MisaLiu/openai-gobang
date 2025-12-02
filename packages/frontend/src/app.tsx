import { useEffect, useRef, useState } from 'preact/hooks'
import GameStore from './state/game'
import SettingsPanel from './Panel/SettingsPanel'
import GamePanel from './Panel/GamePanel'
import './app.css'

export function App() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [ isGamePlaying, setIsGamePlaying ] = useState<boolean>(false);
  const [ gameResult, setGameResult ] = useState<1 | 2 | null>(null);

  const updateGameResult = () => {
    const { result } = GameStore.getState();
    if (result === null) return;

    setGameResult(result);
    if (dialogRef.current) dialogRef.current.showModal();
  };

  useEffect(() => {
    return GameStore.subscribe((s, p) => {
      if (s.ws !== p.ws) setIsGamePlaying(!!s.ws);
      if (s.result !== p.result) updateGameResult();
    });
  }, []);

  return (
    <>
      {!isGamePlaying ? (
        <SettingsPanel />
      ) : (
        <GamePanel />
      )}
      <dialog
        open={gameResult !== null}
        ref={dialogRef}
      >
        <header>游戏结束</header>
        <form method="dialog">
          <p>{gameResult === 1 ? '您赢了！' : '您输了'}</p>
          <p>
            {gameResult === 1 ? (
              '您成功阻止了人工智能毁灭地球。'
            ) : (
              '人类还是没能逃过被人工智能统治的命运。'
            )}
          </p>
          <menu>
            <button onClick={() => window.history.go(0)}>再来一把</button>
            <button>关闭</button>
          </menu>
        </form>
      </dialog>
    </>
  )
}
