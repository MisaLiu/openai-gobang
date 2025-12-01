import { WebSocketServer } from 'ws';
import type WebSocket from 'ws';
import { applyWebSockerRouter } from './router';
import type { WebSocketMessage } from './types';

export const createWebSocketServer = (pathname: string, { server, ...options }: WebSocket.ServerOptions) => {
  const wss = new WebSocketServer({ ...options, noServer: true });

  wss.on('connection', (ws, req) => {
    if ((req.url || '/') !== pathname) {
      return ws.close();
    }

    ws.on('message', (e) => {
      try {
        const msg = e.toString();
        const json = JSON.parse(msg) as WebSocketMessage;
        applyWebSockerRouter(json, ws);
      } catch (e) {
        console.error('An error occurred when parsing client message.');
        console.error(e);
      }
    });
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
