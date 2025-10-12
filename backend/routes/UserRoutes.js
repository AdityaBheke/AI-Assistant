import express from 'express';
import { registerUser, loginUser, getAllUsers } from '../controllers/UserController.js';
import ValidationMiddleware from '../middlewares/ValidationMiddleware.js';

const userRouter = express.Router();

// List all Users
userRouter.get('/', getAllUsers);
// User Registration
userRouter.post('/register', ValidationMiddleware.validate(ValidationMiddleware.userValidators.register), registerUser);
// User Login
userRouter.post('/login', ValidationMiddleware.validate(ValidationMiddleware.userValidators.login), loginUser);

export default userRouter;