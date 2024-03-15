import express from 'express';
import {
  getTarotReading,
  newTarotReading,
  updateTarotReading,
  deleteTarotReading,
} from '../services/tarotReadingService.js';
import { authorization } from '../services/userService.js';

const tarotReadingRouter = express.Router();

tarotReadingRouter.get('/tarotReading', authorization, getTarotReading);
tarotReadingRouter.post('/tarotReading', authorization, newTarotReading);
tarotReadingRouter.put('/tarotReading/:id', authorization, updateTarotReading);
tarotReadingRouter.delete('/tarotReading/:id', authorization, deleteTarotReading);

export default tarotReadingRouter;
