import { logger }  from '@/lib/winston';
import config from '@/config';
import { genUsername } from '@/utils'; 


import User from '@/models/user';
import Token from '@/models/token'

import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type UserData = Pick<IUser, 'username' | 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body as UserData;

    if(role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)){
        res.status(403).json({
            code: 'AuthorizationError',
            message: 'You cannot register as an admin'
        });
        logger.warn(`User with email ${email} tried to register as an admin but is not in the whitelist`);
        return;
    }

    try {
        const username = genUsername();
        const newUser = await User.create({
            username,
            email,
            password,
            role,
        });


        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        await Token.create({ token: refreshToken, userId: newUser._id});
        logger.info('Refresh token created for user', {
            userId: newUser._id,
            token: refreshToken
        });

        res.cookie('refreshgToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict'
        })

        res.status(201).json({
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
            accessToken
        });
        logger.info('User registered successfuly', {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },);
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'An error occurred while registering the user',
            error: err
        });
        logger.error('Error in register controller', err);
}};


export default register;