import GroupBox from './GroupBox'
import ChessBoard from './ChessBoard/ChessBoard'
import HistoryDrawer from './HistoryDrawer/HistoryDrawer'
import { startGame } from './state/game'
import './app.css'

export function App() {
  return (
    <>
      <button onClick={startGame}>WebSocket</button>
      <GroupBox
        title='棋盘'
      >
        <ChessBoard />
      </GroupBox>
      <HistoryDrawer />
    </>
  )
}
