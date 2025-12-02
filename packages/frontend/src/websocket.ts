import EventEmitter from 'eventemitter3';
import { nanoid } from 'nanoid';
import type { ChessPiece } from './types';

export class ChessWebSocket extends EventEmitter {
  private readonly sessionId: string = window.localStorage.getItem('sessiontoken') || nanoid();
  private ws!: WebSocket;
  private mq: (Object | string)[] = [];
  private pingClock?: ReturnType<typeof setInterval>;
  
  constructor(difficulty: 0 | 1 | 2 | 3, size: number = 15, llmFirst = false) {
    super();

    this.start(difficulty, size, llmFirst);
  }

  start(difficulty: 0 | 1 | 2 | 3, size: number = 15, llmFirst = false) {
    this.ws = this.createWs();
    this.send({
      type: 'start',
      data: {
        difficulty, size, llmFirst,
        sessionId: this.sessionId,
      },
    });
  }

  place(piece: ChessPiece) {
    this.send({
      type: 'place',
      data: {
        sessionId: this.sessionId,
        ...piece,
      }
    });
  }

  private createWs() {
    if (this.ws && this.ws.readyState === 1) return this.ws;
    if (this.pingClock) clearInterval(this.pingClock);

    const ws = new WebSocket('./api/ws');

    ws.onopen = this.handleOpen.bind(this);

    ws.onmessage = this.handleMessage.bind(this);

    ws.onerror = (e) => {
      this.emit('error', e);
    };

    ws.onclose = () => {
      this.emit('closed');
    };

    return ws;
  }

  private send(message: Object | string) {
    if (!this.ws || this.ws.readyState !== 1) {
      this.mq.push(message);
      return;
    }

    if (typeof message === 'string') this.ws.send(message);
    else this.ws.send(JSON.stringify(message));
  }

  private sendMQ() {
    if (!this.ws) return;
    if (this.ws.readyState !== 1) return;
    if (this.mq.length === 0) return;

    for (const message of this.mq) {
      this.send(message);
    }
    this.mq.length = 0;
  }

  private startPingClock() {
    if (this.pingClock !== (void 0)) return;

    this.pingClock = setInterval(() => {
      this.send({
        type: 'ping',
        timestamp: Date.now(),
      });
    }, 30000);
  }

  private handleOpen() {
    this.sendMQ();
    this.startPingClock();
    this.emit('connection', this);
  }

  private handleMessage(e: MessageEvent) {
    try {
      const json = JSON.parse(e.data);
      json._raw = e.data;
      
      const { type, data } = json;

      switch (type) {
        case 'ready': {
          this.emit('ready', data);
          break;
        }

        case 'placeLLM': {
          this.emit('place', data);
          break;
        }

        case 'stream': {
          this.emit('stream', data);
          break;
        }

        default: {};
      };
    } catch {}
  }
};
