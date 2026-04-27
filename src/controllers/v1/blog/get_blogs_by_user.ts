import { logger } from "@/lib/winston";
import config from "@/config";

import User from "@/models/user";
import Blog from "@/models/blog";


import type { Request, Response } from "express";

interface QueryType {
    status?: 'draft' | 'published' | 'archived';
}


const getBlogsByUser = async (req: Request, res: Response): Promise<void> => {
    

    try{
        const userId = req.params.userId;
        const currentUserId = req.userId;
        const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
        const offset = parseInt(req.query.offset as string) || config.defaultResOffset;

        const currentUser = await User.findById(currentUserId).select('role').lean().exec();
        const query:  QueryType = {}; 

        if(currentUser?.role === 'user'){
            query.status = 'published';
        }

        
        const total = await Blog.countDocuments({author: userId, ...query});
        const blogs = await Blog.find({author: userId, ...query})
        .select('-banner.publicId -__v')
        .populate('author', '-createdAt -updatedAt -__v')
        .limit(limit)
        .skip(offset)
        .sort({ createdAt: -1})
        .lean()
        .exec();

        res.status(200).json({
            limit,
            offset,
            total,
            blogs
        });
        

    } catch (err){
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while fetching blogs for the specified user',
            status: 'error',
        });
        logger.error('Error while fetching blogs for user', { err });
        return; 
    }

}



export default getBlogsByUser;