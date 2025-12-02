import { createStore } from 'zustand';
import SettingsStore from './settings';
import ThoughtStore, { appendThought } from './thought';
import { ChessWebSocket } from '../websocket';
import type { ChessPiece, PlaceHistory } from '../types';

interface IGameStore {
  isStarted: boolean,
  allowPlace: boolean,

  userPlaceStartTime: number,
  pieces: ChessPiece[],
  histories: PlaceHistory[],

  ws: ChessWebSocket | null,
}

const GameStore = createStore<IGameStore>(() => ({
  isStarted: false,
  allowPlace: false,

  userPlaceStartTime: -1,
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
    const currentTime = Date.now();

    GameStore.setState({
      userPlaceStartTime: currentTime,
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
            timestamp: currentTime,
            timeSpent: 0
          }
        ],
      });
    }

    ThoughtStore.setState({
      thought: data.thoughts,
    });
  });

  ws.on('place', (data: { thoughts?: string, piece: ChessPiece, timeSpent?: number }) => {
    const currentTime = Date.now();
    const { pieces, histories } = GameStore.getState();
    
    GameStore.setState({
      userPlaceStartTime: currentTime,
      pieces: [ data.piece, ...pieces ],
      histories: [
        {
          placedBy: 'llm',
          piece: data.piece,
          timeSpent: data.timeSpent || 0,
          timestamp: currentTime,
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

  const currentTime = Date.now();
  const { userPlaceStartTime, pieces, histories } = GameStore.getState();
  GameStore.setState({
    pieces: [ piece, ...pieces ],
    histories: [
      {
        placedBy: 'user',
        piece,
        timestamp: currentTime,
        timeSpent: (currentTime - userPlaceStartTime) / 1000,
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
