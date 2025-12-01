import { WebSocketServer } from 'ws';
import type WebSocket from 'ws';

export const createWebSocketServer = (pathname: string, options?: WebSocket.ServerOptions) => {
  const wss = new WebSocketServer(options);

  wss.on('connection', (ws, req) => {
    if ((req.url || '/') !== pathname) {
      return ws.close();
    }

    ws.send('Hello world!');
    console.log('A WebSocket client has connected');
  });
};
