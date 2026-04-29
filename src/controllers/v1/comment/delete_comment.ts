import { logger } from '@/lib/winston';

import Blog from '@/models/blog';
import Comment from '@/models/comment';
import User from '@/models/user';




import type { Request, Response } from 'express';


const deleteComment = async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;
    const currentUserId = req.userId;

    try{
        const comment = await Comment.findById(commentId).select('userId blogId').lean().exec();
        const user = await User.findById(currentUserId).select('role').lean().exec(); 
        

        if(!comment){
            res.status(404).json({
                code: 'CommentNotFound',
                message: 'Comment post not found',
                status: 'error',
            });
            return; 
        }
        
        const blog = await Blog.findById(comment.blogId).select('commentsCount').exec();
        if(!blog){
            res.status(404).json({
                code: 'BLOG_NOT_FOUND',
                message: 'Blog post not found',
                status: 'error',
            });
            return; 
        }
        

        if(comment.userId !== currentUserId && user?.role !== 'admin'){
            res.status(403).json({
                code: 'AuthorizationError',
                message: 'Access Denied'
            });

            logger.warn('A user tried to delete a comment without permission', {
                userId: currentUserId,
                commentId,
            });
            return;
        }

        await Comment.deleteOne({ _id: commentId });

        logger.info('Content deleted....', {
            commentId
        });

        blog.commentsCount--;
        await blog.save();
        
        logger.info('Blog comments count updated', {
            blogId: blog._id,
            commentscount: blog.commentsCount,
        });

        res.sendStatus(204);

    } catch (err){
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while deleting comments',
            status: 'error',
        });
        logger.error('Error while deleting comments', { err });
        return; 
    }

}



export default deleteComment;