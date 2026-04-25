import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import { logger } from '@/lib/winston';

import blog from '@/models/blog';

import type { Request, Response } from 'express';
import type { IBlog } from '@/models/blog';


type BlogData = Pick<IBlog, 'title' | 'slug' | 'content' | 'banner' | 'status'>



const window = new JSDOM('').window;
const purify = DOMPurify(window);


const createBlog = async (req: Request, res: Response): Promise<void> => {

    try{
       const { title, slug, content, banner, status } = req.body as BlogData;
       const userId = req.userId;

       const cleanContent = purify.sanitize(content);

       const newBlog = await blog.create({
        title,
        content: cleanContent,
        slug,
        banner,
        status,
        author: userId,
       });
       logger.info('Blog post created successfully', newBlog);

       res.status(201).json({
        blog: newBlog,
        message: 'Blog post created successfully',
        status: 'success',
       });
       return; 
    

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



export default createBlog;