import { v2 as clodinary } from 'cloudinary';


import config from '@/config';
import { logger } from '@/lib/winston';


import type { UploadApiResponse } from 'cloudinary';

clodinary.config({
    clodu_name: config.CLODINARY_CLOUD_NAME,
    api_key: config.CLODINARY_API_KEY,
    api_secret: config.CLODINARY_API_SECRET,
    secure: config.NODE_ENV === 'production',
});

const uploadToCloudinary = (buffer: Buffer<ArrayBufferLike>, publicId?: string): Promise<UploadApiResponse | undefined> => {
    return new Promise((resolve, reject) => {
        clodinary.uploader.upload_stream({
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            resource_type: 'image',
            folder: 'blog-api',
            public_id: publicId,
            transformation: {quality: 'auto'},
        }, (err, result) => {
            if(err){
                logger.error('Error while uploading to Cloudinary', { err });
                reject(err);
            }
            resolve(result);    
        }).end(buffer);
    })
}


export default uploadToCloudinary;