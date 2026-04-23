import { Router } from 'express';
import { param, query, body } from 'express-validator';




import authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';

import User from '@/models/user';

import getCurrentUser from '@/controllers/v1/user/get_current_user';
import updateCurrentUser from '@/controllers/v1/user/update_current_user';
import deleteCurrentUser from '@/controllers/v1/user/delete_current_user';

const router = Router();

router.get(
    '/current', 
    authenticate, 
    authorize(['admin', 'user']),
    getCurrentUser
);


router.put(
    '/current',
    authenticate,
    authorize(['admin', 'user']),
    body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .custom(async (value) => {
        const userExists = await User.exists({ username: value });
        if(userExists){
            throw Error('Username already in use');

        }
    }),
    body('email')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Email must be less than 100 characters')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (value) => {
        const userExists = await User.exists({ email: value });
        if(userExists){
            throw Error('Email already in use');

        }
    }),
    body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
    body('first_name')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name must be less than 50 characters'),
    body('last_name')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name must be less than 50 characters'),
    body(['website', 'facebook', 'instagram', 'linkedin', 'x', 'youtube'])
    .optional()
    .isURL()
    .withMessage('Invalid URL format')
    .isLength({ max: 200 })
    .withMessage('URL must be less than 200 characters'),
    validationError,
    updateCurrentUser
);

router.delete(
    '/current',
    authenticate,
    authorize(['admin', 'user']),
    deleteCurrentUser,
);


export default router;