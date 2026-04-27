import { Router } from "express";
import { body, param } from 'express-validator'

import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import validationError from "@/middlewares/validationError";

import LikeBlog from "@/controllers/v1/like/like_blogs";
import UnLikeBlog from "@/controllers/v1/like/unlike_blogs";


const router = Router();

router.post(
    '/blog/:blogId',
    authenticate,
    authorize(['user', 'admin']),
    param('blogId').isMongoId().withMessage('Invalid Mongo Db'),
    body('userId').notEmpty().withMessage('User not found').isMongoId().withMessage('Invalid user'),
    validationError,
    LikeBlog

);

router.delete(
    '/blog/:blogId',
    authenticate,
    authorize(['user', 'admin']),
    param('blogId').isMongoId().withMessage('Invalid Mongo Db'),
    body('userId').notEmpty().withMessage('User not found').isMongoId().withMessage('Invalid user'),
    validationError,
    UnLikeBlog

)

export default router;