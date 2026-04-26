import { logger } from "@/lib/winston";


import Blog from "@/models/blog";

import uploadToCloudinary from "@/lib/cloudinary";

import type { Request, Response, NextFunction } from "express";
import type { UploadApiResponse } from "cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const uploadBlogBanner = (method: 'create' | 'update') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if(method === 'update' && !req.file){
            next();
            return;
            
        }
        if (!req.file) {
            res.status(400).json({
                code: 'BANNER_IMAGE_REQUIRED',
                message: 'Banner image is required',
                status: 'error',
            });
            return;
        }
    
    if(req.file.size > MAX_FILE_SIZE){
        res.status(413).json({
            code: 'BANNER_IMAGE_TOO_LARGE',
            message: 'Banner image must be less than 5MB',
            status: 'error',
        });
        return;
        
    }

    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId).select('banner.publicId').exec();


        const data = await uploadToCloudinary(
            req.file.buffer,
            blog?.banner.publicId.replace('blog-api/', '')
        );

        if(!data){
            res.status(500).json({
                code: 'CLOUDINARY_UPLOAD_FAILED',
                message: 'Failed to upload banner image',
                status: 'error',
            });
            logger.error('Cloudinary upload failed', {
                blogId,
                publicId: blog?.banner.publicId,
            });
            return;
        }

        const newBanner = {
            publicId: data.public_id,
            url: data.secure_url,
            width: data.width,
            height: data.height,
        };

        logger.info('Banner image uploaded successfully', {
            blogId,
            banner: newBanner,
        });

        req.body.banner = newBanner;

        next();
           
    } catch (err: UploadApiResponse | any) {
        res.status(err.http_code || 500).json({
            code: err.http_code < 500 ? 'CLOUDINARY_UPLOAD_ERROR' : 'CLOUDINARY_UPLOAD_FAILED',
            message: err.message
        });
        logger.error('Error uploading banner image to Cloudinary', {
            error: err,
        });
    };
    
    };
};

export default uploadBlogBanner;