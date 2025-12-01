import { useState, useRef } from 'preact/hooks'
import ChessBoard from './ChessBoard/ChessBoard'
import HistoryDrawer from './HistoryDrawer/HistoryDrawer'
import HistoryStore from './state/history'
import { startChess } from './api'
import { ChessWebSocket } from './websocket'
import type { ChessPiece } from './types'
import './app.css'

export function App() {
  const wsRef = useRef<ChessWebSocket>(null);
  const thoughtsRef = useRef<string>('');
  const [ gameStarted, setGameStarted ] = useState(false);
  const [ allowPlace, setAllowPlace ] = useState(false);
  const [ pieces, setPieces ] = useState<ChessPiece[]>([]);

  const {
    addHistory,
    getLatestHistory,
    editLatestHistory,
  } = HistoryStore.getState();

  const handleStart = () => {
    startChess()
      .then((result) => {
        console.log(result);
        setGameStarted(true);
        setAllowPlace(true);
      });
  };

  const handlePiecePlaced = (piece: ChessPiece) => {
    if (!wsRef.current) return;

    const ws = wsRef.current;

    setPieces(e => [ ...e, piece ]);
    setAllowPlace(false);
    addHistory({
      placedBy: 'user',
      piece: piece,
      timestamp: Date.now(),
    });

    thoughtsRef.current = '';
    ws.place(piece);
  };

  const createWebSocket = () => {
    if (wsRef.current) return;
    const ws = new ChessWebSocket(1);

    ws.on('ready', () => {
      setGameStarted(true);
      setAllowPlace(true);
    });

    ws.on('stream', (e) => {
      if (!e.reasoning_content) return;

      thoughtsRef.current = thoughtsRef.current + e.reasoning_content;
      if (getLatestHistory()!.placedBy !== 'llm') {
        addHistory({
          placedBy: 'llm',
          thoughts: thoughtsRef.current,
          timestamp: Date.now(),
        });
      } else {
        editLatestHistory({
          thoughts: thoughtsRef.current,
        });
      }
    });

    ws.on('place', (data: { thoughts?: string, piece: ChessPiece, timeSpent?: number }) => {
      setPieces(e => [ ...e, data.piece ]);
      setAllowPlace(true);

      if (!data.thoughts) return;
      thoughtsRef.current = data.thoughts;

      if (getLatestHistory()!.placedBy !== 'llm') {
        addHistory({
          placedBy: 'llm',
          piece: data.piece,
          thoughts: thoughtsRef.current,
          timeSpent: data.timeSpent,
          timestamp: Date.now(),
        });
      } else {
        editLatestHistory({
          piece: data.piece,
          thoughts: data.thoughts,
          timeSpent: data.timeSpent,
        });
      }
    });

    wsRef.current = ws;
  };

  return (
    <>
      {!gameStarted && (
        <button onClick={handleStart}>Start</button>
      )}
      <button onClick={createWebSocket}>WebSocket</button>
      <ChessBoard
        pieces={pieces}
        onPlaced={handlePiecePlaced}
        allowPlace={gameStarted && allowPlace}
        placeType='black'
      />
      <HistoryDrawer />
    </>
  )
}
