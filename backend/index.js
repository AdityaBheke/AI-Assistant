import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/mongoose.connection.js';
import userRouter from './routes/UserRoutes.js';
import productRouter from './routes/ProductRoute.js';
import leadRouter from './routes/LeadRoutes.js';
import emailLogRouter from './routes/EmailLogRoute.js';
import conversationRouter from './routes/ConversationRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors());
// Basic route
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Hello, World!', result: null });
});

// Mount routers
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/leads', leadRouter);
app.use('/api/emails', emailLogRouter);
app.use('/api/conversations', conversationRouter);

// 404 handler for unknown API routes — standardized response
app.use((req, res, next) => {
    return res.status(404).json({ success: false, message: 'API route not found', error: null });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const status = err.statusCode || err.status || 500;
    const payload = {
        success: false,
        message: err.message || 'Internal Server Error',
        error: err.details || null,
    };
    return res.status(status).json(payload);
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