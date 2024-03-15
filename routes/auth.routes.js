import express from 'express';
import {
  createAccount,
  login,
  logout,
  authorization,
} from '../services/userService.js';

const authRouter = express.Router(); 

authRouter.post('/createAccount', createAccount);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

export default authRouter;
