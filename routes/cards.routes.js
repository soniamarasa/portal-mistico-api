import express from 'express';
import {
  getCards,
  newCard,
  updateCard,
  deleteCard,
} from '../services/cardService.js';
import { authorization } from '../services/userService.js';

const cardsRouter = express.Router();

cardsRouter.get('/cards', authorization, getCards); 
cardsRouter.post('/cards', authorization, newCard);
cardsRouter.put('/cards/:id', authorization, updateCard);
cardsRouter.delete('/cards/:id', authorization, deleteCard);

export default cardsRouter;
