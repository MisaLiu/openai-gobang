import { WebSocketServer } from 'ws';
import type WebSocket from 'ws';

export const createWebSocketServer = (pathname: string, { server, ...options }: WebSocket.ServerOptions) => {
  const wss = new WebSocketServer({ ...options, noServer: true });

  wss.on('connection', (ws, req) => {
    if ((req.url || '/') !== pathname) {
      return ws.close();
    }

    ws.send('Hello world!');
    console.log('A WebSocket client has connected');
  });
  
  if (!server) return;
  server.on('upgrade', (req, socket, head) => {
    if ((req.url || '/') !== pathname) {
      return socket.destroy();
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  });
};
