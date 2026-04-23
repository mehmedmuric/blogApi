import { Router } from 'express';
import { body, cookie } from 'express-validator';
import bcrypt from 'bcrypt';    


import register from '@/controllers/v1/auth/register';
import login from '@/controllers/v1/auth/login';
import refreshToken from '@/controllers/v1/auth/refresh_token';


import validationError from '@/middlewares/validationError';


import User from '@/models/user';


const router = Router ();
router.post('/register', 
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email required')
    .isLength({ max: 50})
    .withMessage('Email must be less than 50')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
        const userExists = await User.exists({ email: value });
        if(!userExists){
            throw new Error('User email or password is invalid')
        }
    }),
    body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
    body('role')
    .optional()
    .isString()
    .withMessage('Role must be string')
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user'),
    validationError,
    register
);


router.post('/login', 
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email required')
    .isLength({ max: 50})
    .withMessage('Email must be less than 50')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
        const userExists = await User.exists({ email: value });
        if(userExists){
            throw new Error('User email or password is invalid')
        }
    }),
    body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .custom(async (value, { req }) => {
        const { email } = req.body as { email: string };
        const user = await User.findOne({ email })
        .select('password')
        .lean()
        .exec();

        if(!user){
            throw new Error('User email or password is invalid')
        };

        const passwordMatch = await bcrypt.compare(value, user.password);

        if(!passwordMatch){
            throw new Error('User email or password is invalid')
        }
    }),
    validationError,
     login
);

router.post(
    '/refresh-token', 
    cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isJWT()
    .withMessage('Invalid refresh token'),
    validationError,
    refreshToken);

export default router;