import { useState, useRef } from 'preact/hooks'
import ChessBoard from './ChessBoard/ChessBoard'
import { placePiece, startChess } from './api'
import { ChessWebSocket } from './websocket'
import type { ChessPiece } from './types'
import './app.css'

export function App() {
  const wsRef = useRef<ChessWebSocket>(null);
  const thoughtsRef = useRef<string>('');
  const [ gameStarted, setGameStarted ] = useState(false);
  const [ allowPlace, setAllowPlace ] = useState(false);
  const [ pieces, setPieces ] = useState<ChessPiece[]>([]);
  const [ thoughts, setThoughts ] = useState('');

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

    thoughtsRef.current = '';
    setThoughts('');

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
      setThoughts(thoughtsRef.current);
    });

    ws.on('place', (data: { thoughts?: string, piece: ChessPiece }) => {
      setPieces(e => [ ...e, data.piece ]);
      setAllowPlace(true);

      if (!data.thoughts) return;
      thoughtsRef.current = data.thoughts;
      setThoughts(data.thoughts);
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
      <div class="thoughts">{thoughts}</div>
    </>
  )
}
