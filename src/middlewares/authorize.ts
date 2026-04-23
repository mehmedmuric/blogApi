import  { logger } from '@/lib/winston';

import User from '@/models/user';

import type { Request, Response, NextFunction } from 'express';




export type AuthRole = 'admin' | 'user';

const authorize = (roles: AuthRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;

        try{
            const user = await User.findById(userId).select('role').exec();

            if(!user){
                res.status(404).json({
                    code: 'USER_NOT_FOUND',
                    message: 'User not found',
                    status: 'error',
                });
                return;
            }
            if(!roles.includes(user.role)){
                res.status(403).json({
                    code: 'FORBIDDEN',
                    message: 'Access denied',
                    status: 'error',
                });
                return;
            }
            return next();
        } catch (err) {
            res.status(500).json({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An error occurred while authorizing the user',
                status: 'error',
            });
             logger.error('Authorization error', { err });
             return;
        }
    };
}


export default authorize;