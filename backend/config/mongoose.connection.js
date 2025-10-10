import mongoose from 'mongoose';

/**
 * Connect to MongoDB using mongoose.
 * Reads MONGO_URI from environment. Returns a Promise that resolves when connected.
 */
export default function connectDB() {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/assistant_db';

    const options = {
        // useNewUrlParser and useUnifiedTopology are default in mongoose v6+, but keep for clarity
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    return mongoose.connect(uri, options).then((mongooseInstance) => {
        console.log('Connected to MongoDB');
        return mongooseInstance;
    });
}

export { mongoose };
