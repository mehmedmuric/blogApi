import { logger } from '@/lib/winston';

import Blog from '@/models/blog';
import User from '@/models/user';

import type { Request, Response } from 'express';

import { v2 as cloudinary } from 'cloudinary';


const deleteBlog = async (req: Request, res: Response): Promise<void> => {

    try{
       const userId = req.userId;
       const blogId = req.params.blogId;
       
       const user = await User.findById(userId).select('role').lean().exec();
       const blog = await Blog.findById(blogId).select('author banner.publicId').lean().exec();

       if(!blog){
        res.status(404).json({
            code: 'BLOG_NOT_FOUND',
            message: 'Blog post not found',
            status: 'error',
        });
        return; 
       }

       if(blog.author !== userId && user?.role !== 'admin'){
        res.status(403).json({
            code: 'FORBIDDEN',
            message: 'You do not have permission to delete this blog post',
            status: 'error',
        });
        logger.warn(`User ${userId} attempted to delete blog ${blogId} without permission`);
        return; 
       }

       await cloudinary.uploader.destroy(blog.banner.publicId);
       logger.info(`Deleted banner image for blog ${blogId} from Cloudinary`, { blogId, publicId: blog.banner.publicId });

       await Blog.findByIdAndDelete({ _id: blogId }).exec();
       logger.info(`Deleted blog post ${blogId} from database`, { blogId });
    
       res.sendStatus(204);

    } catch (err){
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while deleting the blog post',
            status: 'error',
        });
        logger.error('Error while deleting blog post', { err });
        return; 
    }

}



export default deleteBlog;