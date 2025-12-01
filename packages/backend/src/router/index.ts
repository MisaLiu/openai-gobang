import express from 'express';
import ChessRouter from './chess.ts';

const router = express.Router();

router.use('/chess', ChessRouter);

export default router;
