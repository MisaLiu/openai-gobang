import OpenAI from 'openai';
import { ChatHistory } from '../cache';
import type { ChatCompletionMessageParam } from 'openai/resources';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_ACCESS_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

export const sendChat = async (sessionId: string, message: string) => {
  let chats: ChatCompletionMessageParam[] = [];

  if (ChatHistory.has(sessionId)) {
    chats = ChatHistory.get(sessionId)!;
  } else {
    chats = [
      { role: 'system', content: '你是人工智能助手' }
    ];
  }

  chats.push({ role: 'user', content: message });

  const completion = await openai.chat.completions.create({
    messages: chats,
    model: process.env.OPENAI_MODEL || 'gpt-4o',
  });

  const [ chatChoice ] = completion.choices;
  if (!chatChoice) throw new Error('Failed to send chat to LLM.');

  const { message: chatMessage } = chatChoice;
  if (!chatMessage) throw new Error('Failed to send chat to LLM.');

  const { content: result } = chatMessage;
  if (!result) throw new Error('Failed to send chat to LLM.');

  chats.push({ role: 'assistant', content: result });
  ChatHistory.set(sessionId, chats);

  return result;
};
