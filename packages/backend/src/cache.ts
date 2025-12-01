import type { ChatCompletionMessageParam } from 'openai/resources';

export const ChatHistory = new Map<string, ChatCompletionMessageParam[]>();
