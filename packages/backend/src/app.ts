import 'dotenv/config';
import express from 'express';

const app = express();

app.use('/', (_req, res) => {
  res.status(200)
    .json({ msg: 'Hello world!' });
});

app.listen(process.env.LISTEN_PORT, () => {
  console.log('Backend is now ready!');
});
