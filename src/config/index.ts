import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    WHITELIST_ORIGINS: ['http://localhost:3000', 'http://example.com'],
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/blog-api',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};


export default config;