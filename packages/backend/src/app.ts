import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import APIRouter from './router/index.ts';

const app = express();

app.use(session({ secret: `openai-gobang-${Date.now()}` }));
app.use(express.json());

app.use('/api', APIRouter);

app.use('/', (_req, res) => {
  res.status(200)
    .json({ msg: 'Hello world!' });
});

app.listen(process.env.LISTEN_PORT || 5678, () => {
  console.log('Backend is now ready!');
});
