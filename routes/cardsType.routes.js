import express from 'express';
import {
  getCardTypes,
  newCardType,
  updateCardType,
  deleteCardType,
} from '../services/cardTypeService.js';
import { authorization } from '../services/userService.js';

const cardsTypesRouter = express.Router();

cardsTypesRouter.get('/cardsTypes', authorization, getCardTypes); 
cardsTypesRouter.post('/cardsTypes', authorization, newCardType);
cardsTypesRouter.put('/cardsTypes/:id', authorization, updateCardType);
cardsTypesRouter.delete('/cardsTypes/:id', authorization, deleteCardType);

export default cardsTypesRouter;
