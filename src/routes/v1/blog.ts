import { Router } from 'express';
import { param, query, body } from 'express-validator';
import multer from 'multer';

import createBlog from '@/controllers/v1/blog/create_blog';
import getAllBlogs from '@/controllers/v1/blog/get_all_blogs';
import getBlogsByUser from '@/controllers/v1/blog/get_blogs_by_user';
import getBlogBySlug from '@/controllers/v1/blog/get_blog_by_slug';
import updateBlog from '@/controllers/v1/blog/update_blog'; 
import deleteBlog from '@/controllers/v1/blog/delete_blog';


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
);


router.get(
    '/',
    authenticate,
    authorize(['admin', 'user']),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
    validationError,

    getAllBlogs
);

router.get(
    '/user/:userId',
    authenticate,
    authorize(['admin', 'user']),
    param('userId').isMongoId().withMessage('Invalid user ID'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
    validationError,

    getBlogsByUser
);


router.get(
    '/:slug',
    authenticate,
    authorize(['admin', 'user']),
    param('slug').notEmpty().withMessage('Slug is required'),
    validationError,

    getBlogBySlug
)


router.put(
    '/:blogId',
    authenticate,
    authorize(['admin']),
    param('blogId').isMongoId().withMessage('Invalid blog ID'),
    upload.single('banner'),
    body('title').optional().isString().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
    body('content').optional().isString().isLength({ min: 20 }).withMessage('Content must be at least 20 characters long'),
    body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status. Allowed values are draft, published, archived'),
    validationError,
    uploadBlogBanner('update'),
    updateBlog,
);


router.delete(
    '/:blogId',
    authenticate,
    authorize(['admin']),
    deleteBlog,
);


export default router;