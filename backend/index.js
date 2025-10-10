import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/mongoose.connection.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors());
// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// 404 handler for unknown API routes
app.use((req, res, next) => {
    const err = new Error('API route not found');
    err.status = 404;
    next(err);
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const payload = {
        message: err.message || 'Internal Server Error',
    };
    res.status(status).json(payload);
});

// Start server after DB connection
const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB. Server not started.');
        console.error(err);
        process.exit(1);
    }
};

start();