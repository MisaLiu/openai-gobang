import { createStore } from 'zustand';
import SettingsStore from './settings';
import ThoughtStore, { appendThought } from './thought';
import { ChessWebSocket } from '../websocket';
import type { ChessPiece, PlaceHistory } from '../types';

interface IGameStore {
  isStarted: boolean,
  allowPlace: boolean,

  pieces: ChessPiece[],
  histories: PlaceHistory[],

  ws: ChessWebSocket | null,
}

const GameStore = createStore<IGameStore>(() => ({
  isStarted: false,
  allowPlace: false,

  pieces: [],
  histories: [],

  ws: null,
}));

export const startGame = () => {
  const settings = SettingsStore.getState();

  let ws = GameStore.getState().ws;
  if (!ws) ws = new ChessWebSocket(settings.difficulty, settings.boardSize, settings.llmFirst);
  else {
    ws.removeAllListeners();
    ws.start(settings.difficulty, settings.boardSize, settings.llmFirst);
  }

  ws.once('ready', (data: { piece?: ChessPiece, thoughts?: string }) => {
    GameStore.setState({
      isStarted: true,
      allowPlace: true,
    });

    if (data.piece) {
      GameStore.setState({
        pieces: [ data.piece ],
        histories: [
          {
            placedBy: 'llm',
            piece: data.piece,
            timestamp: Date.now(),
          }
        ],
      });

      ThoughtStore.setState({
        thought: data.thoughts,
      });
    }
  });

  ws.on('place', (data: { thoughts?: string, piece: ChessPiece, timeSpent?: number }) => {
    const { pieces, histories } = GameStore.getState();

    GameStore.setState({
      pieces: [ data.piece, ...pieces ],
      histories: [
        {
          placedBy: 'llm',
          piece: data.piece,
          timeSpent: data.timeSpent,
          timestamp: Date.now(),
        },
        ...histories
      ],
      allowPlace: true,
    });

    ThoughtStore.setState({
      thought: data.thoughts,
    });
  });

  ws.on('stream', (data: { content: string, reasoning_content?: string }) => {
    if (typeof data.reasoning_content !== 'string') return;
    appendThought(data.reasoning_content);
  });

  GameStore.setState({
    ws,
  });
};

export const placePiece = (piece: ChessPiece) => {
  const { ws } = GameStore.getState();
  if (!ws) return;

  const { pieces, histories } = GameStore.getState();
  GameStore.setState({
    pieces: [ piece, ...pieces ],
    histories: [
      {
        placedBy: 'user',
        piece,
        timestamp: Date.now(),
      },
      ...histories,
    ],
    allowPlace: false,
  });

  ThoughtStore.setState({
    thought: '',
  });

  ws.place(piece);
};

export default GameStore;
