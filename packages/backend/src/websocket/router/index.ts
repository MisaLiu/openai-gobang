import { sendChat, sendChatStream } from '../../utils/openai';
import { buildPrompt } from '../../utils/prompt';
import { parseString, buildString } from '../../utils/chess';
import type WebSocket from 'ws';
import type { WebSocketMessage } from '../types';

export const applyWebSockerRouter = (msg: WebSocketMessage, ws: InstanceType<typeof WebSocket>) => {
  const sendMsg = (msg: WebSocketMessage) => {
    if (typeof msg === 'string') ws.send(msg);
    ws.send(JSON.stringify(msg));
  };

  const { type, data } = msg;

  switch (type) {
    case 'start': {
      sendChat(data.sessionId, 'READY', buildPrompt(data.difficulty, data.size, data.llmFirst))
        .then((e) => {
          sendMsg({
            type: 'ready',
            data: {
              ready: e.message === 'READY',
              piece: parseString(e.message),
              original: e.message,
              thoughts: e.thoughts || (void 0),
            }
          });
        })
        .catch((e) => {
          console.error(e);
        });
      break;
    }

    case 'place': {
      sendChatStream(data.sessionId, buildString(data))
        .onStream((stream) => {
          sendMsg({
            type: 'stream',
            data: {
              content: stream.content,
              reasoning_content: stream.reasoning_content,
            }
          });
        })
        .then((e) => {
          sendMsg({
            type: 'placeLLM',
            data: {
              piece: parseString(e.message),
              thoughts: e.thoughts,
              original: e.message,
              timeSpent: e.timeSpent,
            },
          });
        })
        .catch((e) => {
          console.error(e);
        })
      break;
    }

    case 'ping': {
      sendMsg({
        type: 'pong',
        data: (void 0),
        timestamp: Date.now(),
      });
      break;
    }
  }
};
