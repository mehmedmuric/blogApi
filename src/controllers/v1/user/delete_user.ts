import { logger } from "@/lib/winston";
import { v2 as cloudinary } from "cloudinary";

import User from "@/models/user";
import Blog from "@/models/blog";


import type { Request, Response } from "express";

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;

    try{
        const blogs = await Blog.find({author: userId}).select('banner.publicId').lean().exec();        
           
        const publicIds = blogs.map(({ banner }) => banner.publicId);
        
        await cloudinary.api.delete_resources(publicIds);   
        logger.info('Multiple banner images deleted from Cloudinary', { userId, publicIds });
           
        await Blog.deleteMany({ author: userId });
        logger.info('Blogs deleted successfully', { userId, blogCount: blogs.length });     
        
        await User.deleteOne({ _id: userId });
        logger.info('User deleted successfully', { userId });

        res.sendStatus(204);
    } catch (err){
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while deleting the user',
            status: 'error',
        });
        logger.error('Error while deleting user', { err });
        return; 
    }

}



export default deleteUser;