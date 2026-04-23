import { logger } from "@/lib/winston";

import User from "@/models/user";
import type { Request, Response } from "express";

const deleteCurrentUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    try{
                
        
        await User.deleteOne({ _id: userId });
        logger.info('User deleted successfully', { userId });

        res.sendStatus(204);
    } catch (err){
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while deleting the current user',
            status: 'error',
        });
        logger.error('Error while deleting current user', { err });
        return; 
    }

}



export default deleteCurrentUser;