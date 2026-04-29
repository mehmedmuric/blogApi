import { logger } from '@/lib/winston';

import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import Blog from '@/models/blog';
import Comment from '@/models/comment';




import type { Request, Response } from 'express';
import type { IComment } from '@/models/comment'

type CommentData = Pick<IComment, 'content'>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);



const commentBlog = async (req: Request, res: Response): Promise<void> => {
    const { content } = req.body as CommentData;
    const blogId = req.params.blogId as string;
    const userId = req.userId;

    try{
        const blog = await Blog.findById(blogId).select('_id commentsCount').exec();
        if(!blog){
            res.status(404).json({
                code: 'BLOG_NOT_FOUND',
                message: 'Blog post not found',
                status: 'error',
            });
            return; 
        }

        const cleanContent = purify.sanitize(content);
        const newComment = await Comment.create({
            blogId,
            content: cleanContent,
            userId,
        });

        logger.info('new comment Create', newComment)

        blog.commentsCount++;
        await blog.save();

        logger.info(`User ${userId} commented blog post ${blogId}`);

        res.status(201).json({
            code: 'Comment posted',
            message: 'Blog post commented successfully',
            status: 'success',
        });
           
    } catch (err){
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while commenting the blog post',
            status: 'error',
        });
        logger.error('Error while commenting blog post', { err });
        return; 
    }

}



export default commentBlog;