const mongoose = require('mongoose');

// Disable buffering so queries fail-fast to in-memory fallback if MongoDB is offline
mongoose.set('bufferCommands', false);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_exam_db', {
            serverSelectionTimeoutMS: 1500
        });
        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (err) {
        console.warn('⚠️ Note: MongoDB offline. App will run seamlessly using in-memory store.');
    }
};

module.exports = connectDB;
