import { Router } from 'express';

// import { authMiddleware } from '../../middlewares/auth.middleware';
import { createBill } from './bill.controller';
import { uploadMiddleware } from '../../middlewares/upload.middleware';

const billRoute = Router();

billRoute.post(
    '/',
    uploadMiddleware({ allowed_formats: ['pdf'] }).single('pdf'),
    createBill,
);

export { billRoute };
