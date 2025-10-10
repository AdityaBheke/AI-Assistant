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
// If FRONTEND_URL is set in env, allow only that origin. Otherwise reflect the request origin.
const corsOptions = {
    origin: process.env.FRONTEND_URL || true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // enable pre-flight for all routes

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
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