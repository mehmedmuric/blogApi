import { logger } from '@/lib/winston';

import Blog from '@/models/blog';
import Like from '@/models/like';




import type { Request, Response } from 'express';


const LikeBlog = async (req: Request, res: Response): Promise<void> => {
    const { blogId } = req.params;
    const { userId } = req.body;

    try{
        const blog = await Blog.findById(blogId).select('likeCount').exec();
        if(!blog){
            res.status(404).json({
                code: 'BLOG_NOT_FOUND',
                message: 'Blog post not found',
                status: 'error',
            });
            return; 
        }

        const existingLike = await Like.findOne({ blogId, userId }).lean().exec();
        if(existingLike){
            res.status(400).json({
                code: 'ALREADY_LIKED',
                message: 'You have already liked this blog post',
                status: 'error',
            });
            return;
        };

        const like = new Like({
            blogId,
            userId,
        });
        await like.save();

        blog.likesCount++;
        await blog.save();

        logger.info(`User ${userId} liked blog post ${blogId}`);

        res.status(200).json({
            code: 'LIKE_SUCCESS',
            message: 'Blog post liked successfully',
            status: 'success',
        });
           
    } catch (err){
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while creating the blog post',
            status: 'error',
        });
        logger.error('Error while creating blog post', { err });
        return; 
    }

}



export default LikeBlog;