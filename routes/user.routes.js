import express from 'express';
import {
  recoverPassword,
  resetPassword,
  getUser,
  updateUser,
  authorization,
} from '../services/userService.js';

const userRouter = express.Router();

userRouter.post('/retrievePassword', recoverPassword);
userRouter.post('/resetPassword', authorization, resetPassword);
userRouter.get('/user/:userId', authorization, getUser);
userRouter.put('/updateUser/:id', authorization, updateUser);

export default userRouter;
