import dotenv from 'dotenv';

import type ms from 'ms'

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    WHITELIST_ORIGINS: ['http://localhost:3000', 'http://example.com'],
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/blog-api',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    ACCES_TOKEN_EXPIRY: process.env.ACCES_TOKEN_EXPIRY as ms.StringValue,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
    WHITELIST_ADMINS_MAIL: [
        'mehmedmuric22@gmail.com',
        'mehmedmuric33@gmail.com'
    ],
    defaultResLimit: 20,
    defaultResOffset: 0,
    CLODINARY_CLOUD_NAME: process.env.CLODINARY_CLOUD_NAME!,
    CLODINARY_API_KEY: process.env.CLODINARY_API_KEY!,
    CLODINARY_API_SECRET: process.env.CLODINARY_API_SECRET!,
};


export default config;