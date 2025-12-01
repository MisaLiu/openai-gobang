import express from 'express';
import { startChess, placePiece } from '../controller/chess';
import { hasChat } from '../utils/openai';
import { parseString } from '../utils/chess';

interface InitProps {
  difficulty: 0 | 1 | 2 | 3,
  size: number,
};

const router = express.Router();

router.use((req, res, next) => {
  if (!req.sessionID) {
    return res
      .status(400)
      .json({ msg: 'Bad request. Have you enabled cookie on this site?' });
  }

  next();
});

router.post('/new', (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ msg: 'Invalid request' });
  }

  const { difficulty, size } = req.body as InitProps;
  startChess(req.sessionID, difficulty, size)
    .then((result) => {
      res
        .status(200)
        .json({
          msg: 'ok',
          data: {
            ready: result === 'READY',
            original: result,
          }
        });
    })
    .catch((e) => {
      res
        .status(500)
        .json({ msg: 'Internal server error' });
      console.error(e);
    });
});

router.post('/place', (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ msg: 'Invalid request' });
  }

  if (!hasChat(req.sessionID)) {
    return res
      .status(400)
      .json({ msg: 'Please start a session first!' });
  }

  placePiece(req.sessionID, req.body)
    .then((result) => {
      res
        .status(200)
        .json({
          msg: 'ok',
          data: {
            piece: parseString(result),
            thoughts: null,
            original: result,
          }
        });
    })
    .catch((e) => {
      res
        .status(500)
        .json({ msg: 'Internal server error' });
      console.error(e);
    });
});

export default router;
