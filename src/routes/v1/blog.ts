import { Router } from 'express';
import { param, query, body } from 'express-validator';
import multer from 'multer';

import createBlog from '@/controllers/v1/blog/create_blog';


import authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import uploadBlogBanner from '@/middlewares/uploadBlogBanner';
 

const upload = multer();


const router = Router();

router.post(
    '/',
    authenticate,
    authorize(['admin']),
    upload.single('banner'),
    uploadBlogBanner('create'),
    body('title').isString().isLength({ min: 5, max: 100 }).notEmpty().withMessage('Title is required and must be between 5 and 100 characters'),
    body('content').isString().isLength({ min: 20 }).notEmpty().withMessage('Content is required and must be at least 20 characters long'),
    body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status. Allowed values are draft, published, archived'),
    validationError,
    createBlog
)

export default router;