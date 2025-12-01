import OpenAI from 'openai';
import { ChatHistory } from '../cache';
import { buildPrompt } from './prompt';
import type { ChatCompletionMessage, ChatCompletionMessageParam } from 'openai/resources';

interface $ChatCompletionMessage extends ChatCompletionMessage {
  reasoning_content?: string;
};

interface ChatResponse {
  message: string,
  thoughts: string | null,
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_ACCESS_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

export const hasChat = (sessionId: string) => {
  return ChatHistory.has(sessionId);
};

export const sendChat = (sessionId: string, message: string, prompt?: string) => new Promise<ChatResponse>((res, rej) => {
  let chats: ChatCompletionMessageParam[] = [];

  if (ChatHistory.has(sessionId)) {
    chats = ChatHistory.get(sessionId)!;
  } else {
    chats = [
      { role: 'system', content: prompt || buildPrompt(1, 15) }
    ];
  }

  chats.push({ role: 'user', content: message });
  openai.chat.completions.create({
    messages: chats,
    model: process.env.OPENAI_MODEL || 'gpt-4o',
  }).then((completion) => {
    let thoughts: string | null = null;

    const [ chatChoice ] = completion.choices;
    if (!chatChoice) return rej('Failed to send chat to LLM.');

    const { message: chatMessage } = chatChoice;
    if (!chatMessage) return rej('Failed to send chat to LLM.');
    
    const {
      content: result,
      reasoning_content
    } = chatMessage as $ChatCompletionMessage;
    if (!result) return rej('Failed to send chat to LLM.');
    if (reasoning_content) thoughts = reasoning_content;

    chats.push({ role: 'assistant', content: result });
    ChatHistory.set(sessionId, chats);

    res({
      message: result,
      thoughts,
    });
  }).catch(rej);
});

export const deleteChat = (sessionId: string) => {
  return ChatHistory.delete(sessionId);
};
