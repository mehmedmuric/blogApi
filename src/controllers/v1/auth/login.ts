import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import config from '@/config';


import User from '@/models/user';
import Token from '@/models/token';

import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body as UserData;
        const user = await User.findOne({ email })
        .select('username email password role')
        .lean()
        .exec();

        if(!user){
            res.status(401).json({
                code: 'NotFoundError',
                message: 'User not found'
            });
            return;

        };

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        await Token.create({ token: refreshToken, userId: user._id});
        logger.info('Refresh token created for user', {
            userId: user._id,
            token: refreshToken
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict'
        })

        res.status(201).json({
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
            },
            accessToken
        });
        logger.info('User logged in successfuly', {
                username: user.username,
                email: user.email,
                role: user.role,
            },);
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'An error occurred while registering the user',
            error: err
        });
        logger.error('Error in register controller', err);
}
};

export default login;