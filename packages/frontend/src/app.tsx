import { useEffect, useState } from 'preact/hooks'
import GameStore from './state/game'
import SettingsPanel from './Panel/SettingsPanel'
import GamePanel from './Panel/GamePanel'
import './app.css'

export function App() {
  const [ isGamePlaying, setIsGamePlaying ] = useState<boolean>(false);

  useEffect(() => {
    return GameStore.subscribe((s, p) => {
      if (s.ws !== p.ws) setIsGamePlaying(!!s.ws);
    });
  }, []);

  return (
    <>
      {!isGamePlaying ? (
        <SettingsPanel />
      ) : (
        <GamePanel />
      )}
    </>
  )
}
