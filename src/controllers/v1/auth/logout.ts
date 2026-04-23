import { logger } from "@/lib/winston";
import config from "@/config";


import Token from "@/models/token";


import type { Request, Response } from "express";
import user from "@/models/user";


const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken){
            await Token.deleteOne({ token: refreshToken });

            logger.info('Refresh token deleted', {
                userId: req.userId,
                token: refreshToken
            });
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: config.NODE_ENV === 'production',
                sameSite: 'strict'
            });
        }

        res.sendStatus(204);

        logger.info('User logged out successfuly', {
            userId: req.userId,
        });
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'An error occurred while logging out the user',
            error: err
        });
        logger.error('Error logging out user', err);
}
};

export default logout;