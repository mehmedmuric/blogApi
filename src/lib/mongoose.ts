import mongoose from "mongoose";


import config from "@/config";
import { logger } from "@/lib/winston";

import type { ConnectOptions } from "mongoose";



const clientOptions: ConnectOptions = {
    dbName: 'blog-api',
    appName: 'blogCluster',
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
};


export const connectToDatabase = async (): Promise<void> => {
    if(!config.MONGO_URI){
        throw new Error('MONGO_URI is not defined in environment variables');
    }

    try {
        await mongoose.connect(config.MONGO_URI, clientOptions);
        logger.info('Connected to MongoDB successfully', {
            uri: config.MONGO_URI,
            options: clientOptions,
        });  
        
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
        throw error;
    }
};


export const disconnectFromDatabase = async (): Promise<void> => {
    try{
        await mongoose.disconnect();
        logger.info('Disconnected from MongoDB successfully', {
            uri: config.MONGO_URI,
            options: clientOptions,
        });
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        throw error;
    }
}