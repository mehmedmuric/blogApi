import { logger } from '@/lib/winston';


import Blog from '@/models/blog';
import Comment from '@/models/comment';




import type { Request, Response } from 'express';


const getCommentsByBlog = async (req: Request, res: Response): Promise<void> => {
    const blogId = req.params.blogId as string;

    try{
        const blog = await Blog.findById(blogId).select('_id').lean().exec();
        if(!blog){
            res.status(404).json({
                code: 'BLOG_NOT_FOUND',
                message: 'Blog post not found',
                status: 'error',
            });
            return; 
        }

        const allComments = await Comment.find({ blogId }).sort({ createdAt: -1 }).lean().exec();

        res.status(200).json({
            comments: allComments
        });
           
    } catch (err){
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while retrieving comments',
            status: 'error',
        });
        logger.error('Error while retrieving comments', { err });
        return; 
    }

}



export default getCommentsByBlog;