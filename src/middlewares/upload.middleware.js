import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { nanoid } from 'nanoid';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const storage = (params) =>
    new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'itooth', // tên folder tạo trên cloudinary
            allowed_formats: ['png', 'jpg', 'jpeg'], // chỉ cho phép upload định dạng ảnh png, jpg ,jpeg
            public_id: (req, file) => nanoid(), // random một id ngẫu nhiên cho mỗi ảnh
            ...params,
        },
    });

export const uploadMiddleware = (params = {}) => {
    return multer({ storage: storage(params) });
};
