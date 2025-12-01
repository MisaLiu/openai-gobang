import { hasChat, deleteChat, sendChat } from '../controller/openai';
import { buildPrompt } from '../utils/prompt';
import { buildString } from '../utils/chess';
import type { ChessPiece } from '../types';

export const startChess = (sessionId: string, difficulty: 0 | 1 | 2 | 3, size: number = 15) => {
  if (hasChat(sessionId)) deleteChat(sessionId);
  return sendChat(sessionId, 'READY', buildPrompt(difficulty, size));
};

export const placePiece = (sessionId: string, piece: ChessPiece) => {
  const pieceStr = buildString(piece);
  return sendChat(sessionId, pieceStr);
};
