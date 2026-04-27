import { logger } from "@/lib/winston";

import User from "@/models/user";
import Blog from "@/models/blog";


import type { Request, Response } from "express";


const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
    

    try{
        const userId = req.userId;
        const slug = req.params.slug;


        const user = await User.findById(userId).select('role').lean().exec();
        const blog = await Blog.findOne({ slug })
        .select('-banner.publicId -__v')
        .populate('author', '-createdAt -updatedAt -__v')
        .lean()
        .exec();

        if(!blog){
            res.status(404).json({
                code: 'BLOG_NOT_FOUND',
                message: 'Blog with the specified slug not found',
                status: 'error',
            });
            return; 
        }

        if(user?.role === 'user' && blog.status === 'draft'){
            res.status(403).json({
                code: 'FORBIDDEN',
                message: 'You do not have permission to access this blog',
                status: 'error',
            });
            logger.warn('Unauthorized access attempt to draft blog', { userId, blog });
            return; 
        }


        res.status(200).json({
           blog 
        });
        

    } catch (err){
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while fetching the blog for the specified slug',
            status: 'error',
        });
        logger.error('Error while fetching blog for slug', { err });
        return; 
    }

}



export default getBlogBySlug;