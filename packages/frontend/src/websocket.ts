import EventEmitter from 'eventemitter3';
import { nanoid } from 'nanoid';
import type { ChessPiece } from './types';

export class ChessWebSocket extends EventEmitter {
  private readonly sessionId: string = window.localStorage.getItem('sessiontoken') || nanoid();
  private ws: WebSocket;
  private mq: (Object | string)[] = [];
  private pingClock?: ReturnType<typeof setInterval>;
  
  constructor(difficulty: 0 | 1 | 2 | 3, size: number = 15) {
    super();

    const ws = new WebSocket('./api/ws');

    ws.onopen = () => {
      this.sendMQ();
      this.startPingClock();
      this.emit('connection', this);
    };

    ws.onmessage = (e) => {
      try {
        const json = JSON.parse(e.data);
        json._raw = e.data;
        this.handleMessage(json);
      } catch {}
    };

    ws.onerror = (e) => {
      this.emit('error', e);
    };

    ws.onclose = () => {
      this.emit('closed');
    };

    this.ws = ws;
    this.send({
      type: 'start',
      data: {
        difficulty, size,
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

  private handleMessage(msg: any) {
    const { type, data } = msg;

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
  }
};
