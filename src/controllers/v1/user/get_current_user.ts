import { logger } from "@/lib/winston";

import User from "@/models/user";


import type { Request, Response } from "express";


const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.userId;

        const user = await User.findById(userId).select('-__v').lean().exec();

        res.status(200).json({
            user,
            status: 'success',
        });
        
    } catch (err){
       res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while getting the current user',
            status: 'error',
        });
            logger.error('Error while getting current user', { err });
            return; 
    }
};


export default getCurrentUser;