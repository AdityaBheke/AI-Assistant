import express from 'express';

const userRouter = express.Router();
// List all Users
userRouter.get('/', (req, res) => {
    res.send('User route');
});
// User Registration
userRouter.post('/register', (req, res) => {
    // Registration logic here
    res.send('User registered');
});
// User Login
userRouter.post('/login', (req, res) => {
    // Login logic here
    res.send('User logged in');
});

export default userRouter;