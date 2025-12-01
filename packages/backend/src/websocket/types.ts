import type { ChessPiece } from '../types';

export type WebSocketMessageBase = {
  type: string,
  data: any,
  timestamp?: number,
};

type WebSocketMessageStart = {
  type: 'start',
  data: {
    sessionId: string,
    difficulty: 0 | 1 | 2 | 3,
    size: number,
  }
};

type WebSocketMessageReady = {
  type: 'ready',
  data: {
    ready: boolean,
    piece: ChessPiece | null,
    original: string,
  }
};

type WebSocketMessagePlace = {
  type: 'place',
  data: {
    sessionId: string,
    type: 'black' | 'white',
    row: number,
    column: number,
  }
};

type WebSocketMessageStream = {
  type: 'stream',
  data: {
    content: string,
    reasoning_content?: string,
  }
};

type WebSocketMessagePlaceLLM = {
  type: 'placeLLM',
  data: {
    original: string,
    piece: ChessPiece | null,
    thoughts: string | null,
    timeSpent?: number,
  }
};

type WebSocketMessagePing = {
  type: 'ping',
  data: void,
};

type WebSocketMessagePong = {
  type: 'pong',
  data: void,
};

export type WebSocketMessage = (
  WebSocketMessageStart |
  WebSocketMessageReady |
  WebSocketMessagePlace |
  WebSocketMessageStream |
  WebSocketMessagePlaceLLM |
  WebSocketMessagePing |
  WebSocketMessagePong
) & {
  timestamp?: number;
};
