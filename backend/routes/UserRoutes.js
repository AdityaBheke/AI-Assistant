import express from 'express';
import { registerUser, loginUser, getAllUsers } from '../controllers/UserController.js';

const userRouter = express.Router();

// List all Users
userRouter.get('/', getAllUsers);
// User Registration
userRouter.post('/register', registerUser);
// User Login
userRouter.post('/login', loginUser);

export default userRouter;