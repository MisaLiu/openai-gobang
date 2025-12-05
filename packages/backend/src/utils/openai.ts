import OpenAI from 'openai';
import { ChatHistory } from '../cache';
import { buildPrompt } from './prompt';
import { StreamablePromise } from './class';
import type { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessage } from 'openai/resources';
import type { ChatHistory as IChatHistory } from '../types';

interface OpenAIConfig extends Omit<ChatCompletionCreateParamsNonStreaming, 'messages'> {}

interface $ChatCompletionMessage extends ChatCompletionMessage {
  reasoning_content?: string;
};

interface $IChatHistory extends IChatHistory {
  reasoning_content: string | null;
}

interface ChatResponse {
  message: string,
  timeSpent: number,
  thoughts: string | null,
}

const OpenAIConfig: OpenAIConfig = {
  model: process.env.OPENAI_MODEL || 'gpt-4o',
  temperature: 0.1,
  reasoning_effort: 'high',
  // @ts-expect-error Force models thinking while using VolceEngine.
  thinking: { type: 'enabled' },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_ACCESS_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  // logLevel: 'debug',
});

export const hasChat = (sessionId: string) => {
  return ChatHistory.has(sessionId);
};

export const sendChat = (sessionId: string, message: string, prompt?: string) => new Promise<ChatResponse>((res, rej) => {
  let chats: IChatHistory[] = [];

  if (ChatHistory.has(sessionId) && prompt === (void 0)) {
    chats = ChatHistory.get(sessionId)!;
  } else {
    chats = [
      { role: 'system', content: prompt || buildPrompt(1, 15) }
    ];
  }

  chats.push({ role: 'user', content: message });
  const startTime = performance.now();
  openai.chat.completions.create({
    messages: chats,
    ...OpenAIConfig,
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
      timeSpent: (performance.now() - startTime) / 1000,
      thoughts,
    });
  }).catch(rej);
});

export const sendChatStream = (
  sessionId: string,
  message: string,
  prompt?: string
) => new StreamablePromise<ChatResponse>(async (res, rej, sendStream) => {
  let chats: IChatHistory[] = [];

  if (ChatHistory.has(sessionId) && prompt === (void 0)) {
    chats = ChatHistory.get(sessionId)!;
  } else {
    chats = [
      { role: 'system', content: prompt || buildPrompt(1, 15) }
    ];
  }

  chats.push({ role: 'user', content: message });
  try {
    const startTime = performance.now();
    const stream = await openai.chat.completions.create({
      messages: chats,
      ...OpenAIConfig,
      stream: true,
    });

    const chatResult: $IChatHistory = {
      role: 'assistant',
      content: '',
      reasoning_content: null,
    };

    for await (const part of stream) {
      const { delta: chatPart, finish_reason } = part.choices[0];
      if (!!finish_reason) break;
      if (!chatPart) continue;

      const {
        content,
        reasoning_content,
      } = chatPart as $ChatCompletionMessage;
      if (typeof content !== 'string') continue;

      chatResult.content = chatResult.content + content;
      if (reasoning_content) {
        if (chatResult.reasoning_content === null) chatResult.reasoning_content = '';
        chatResult.reasoning_content = chatResult.reasoning_content + reasoning_content;
      }

      sendStream(chatPart);
    }

    chats.push({ role: 'assistant', content: chatResult.content });
    ChatHistory.set(sessionId, chats);

    res({
      message: chatResult.content,
      timeSpent: (performance.now() - startTime) / 1000,
      thoughts: chatResult.reasoning_content,
    });
  } catch (e) {
    rej(e);
  }
});

export const deleteChat = (sessionId: string) => {
  return ChatHistory.delete(sessionId);
};
