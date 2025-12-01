import express from 'express';

const app = express();

app.use('/', (_req, res) => {
  res.status(200)
    .json({ msg: 'Hello world!' });
});

app.listen(3000, () => {
  console.log('Backend is now ready!');
});
