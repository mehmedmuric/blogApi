import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { verifyAccessToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";

import type { Request, Response, NextFunction } from "express";
import type { Types } from "mongoose";


const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith('Bearer ')){
        res.status(401).json({
            code: 'UnauthorizedError',
            message: 'Authorization header must be in the format Bearer <token>'
        });
        return;
    }

    const [_, token] = authHeader.split(' ');

    try{
        const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId};

        req.userId = jwtPayload.userId;

        return next();
    } catch (err) {
        if(err instanceof TokenExpiredError){
            res.status(401).json({
                code: 'UnauthorizedError',
                message: 'Access token expired'
            });
            return;
        }
        if (err instanceof JsonWebTokenError){
            res.status(401).json({
                code: 'UnauthorizedError',
                message: 'Invalid access token'
            });
            return;
        }

        res.status(500).json({
            code: 'ServerError',
            message: 'An error occurred while authenticating the user',
            error: err
        });
        logger.error('Error authenticating user', err);
    }

}


export default authenticate;