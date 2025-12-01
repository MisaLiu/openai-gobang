import 'dotenv/config';
import express from 'express';
import http from 'http';
import session from 'express-session';
import { createWebSocketServer } from './websocket/index.ts';
import APIRouter from './router/index.ts';

const app = express();
const server = http.createServer(app);
createWebSocketServer('/api/ws', { server });

app.use(session({ secret: `openai-gobang-${Date.now()}` }));
app.use(express.json());

app.use('/api', APIRouter);

app.use('/', (_req, res) => {
  res.status(200)
    .json({ msg: 'Hello world!' });
});

server.listen(process.env.LISTEN_PORT || 5678, () => {
  console.log('Backend is now ready!');
});
