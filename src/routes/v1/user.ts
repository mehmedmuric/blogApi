import { Router } from 'express';
import { param, query, body } from 'express-validator';




import authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';

import User from '@/models/user';

import getCurrentUser from '@/controllers/v1/user/get_current_user';
import updateCurrentUser from '@/controllers/v1/user/update_current_user';
import deleteCurrentUser from '@/controllers/v1/user/delete_current_user';
import getAllUsers from '@/controllers/v1/user/get_all_users';
import getUser from '@/controllers/v1/user/get_user';
import deleteUser from '@/controllers/v1/user/delete_user';

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


router.get(
    '/',
    authenticate,
    authorize(['admin']),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
    validationError,

    getAllUsers
);

router.get(
    '/:userId',
    authenticate,
    authorize(['admin']),
    param('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid User ID format'),
    validationError,
    getUser
)

router.delete(
    '/:userId',
    authenticate,
    authorize(['admin']),
    param('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid User ID format'),
    validationError,
    deleteUser
)


export default router;