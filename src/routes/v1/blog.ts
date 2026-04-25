import { Router } from 'express';
import { param, query, body } from 'express-validator';
import multer from 'multer';

import createBlog from '@/controllers/v1/blog/create_blog';


import authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';

const upload = multer();


const router = Router();

router.post(
    '/',
    authenticate,
    authorize(['admin']),
    upload.single('banner'),
    createBlog
)

export default router;