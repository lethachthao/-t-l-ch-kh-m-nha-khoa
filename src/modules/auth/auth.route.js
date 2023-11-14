import { Router } from 'express';
import { signinController } from './auth.controller';
import { signupController } from './auth.controller';
import { uploadMiddleware } from '../../middlewares/upload.middleware';

const authRoute = Router();

// đăng nhập
authRoute.post('/signin', signinController);

// đăng kí
authRoute.post(
    '/signup',
    uploadMiddleware().single('avatar'),
    signupController,
);

export { authRoute };
