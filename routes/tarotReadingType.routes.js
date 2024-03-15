import express from 'express';
import {
  getTarotReadingTypes,
  newTarotReadingType,
  updateTarotReadingType,
  deleteTarotReadingType,
} from '../services/tarotReadingTypeService.js';
import { authorization } from '../services/userService.js';

const tarotReadingTypeRouter = express.Router();

tarotReadingTypeRouter.get('/tarotReadingTypes', authorization, getTarotReadingTypes); 
tarotReadingTypeRouter.post('/tarotReadingTypes', authorization, newTarotReadingType);
tarotReadingTypeRouter.put('/tarotReadingTypes/:id', authorization, updateTarotReadingType);
tarotReadingTypeRouter.delete('/tarotReadingTypes/:id', authorization, deleteTarotReadingType);

export default tarotReadingTypeRouter;
