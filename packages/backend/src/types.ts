
export interface ChessPiece {
  type: 'black' | 'white',
  row: number,
  column: number,
};

export interface ChatHistory {
  role: 'system' | 'user' | 'assistant',
  content: string,
}
