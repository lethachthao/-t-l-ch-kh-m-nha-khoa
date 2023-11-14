import { Router } from 'express';
import {
    createUser,
    getUsers,
    getUsersByType,
    deleteUser,
    updateUser,
    getDoctors,
    getDoctorDetail,
    getMe,
} from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { uploadMiddleware } from '../../middlewares/upload.middleware';

const userRoute = Router();

userRoute.get('/', getUsers);
userRoute.get('/me', authMiddleware(), getMe);

userRoute.get('/doctors', getDoctors);
userRoute.get('/doctors/:id', getDoctorDetail);

userRoute.get('/:accountType', getUsersByType);
userRoute.post('/', uploadMiddleware().single('avatar'), createUser);
userRoute.delete('/', deleteUser);
userRoute.put('/:id', uploadMiddleware().single('avatar'), updateUser);

export { userRoute };
