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

const userRoute = Router();

userRoute.get('/', getUsers);
userRoute.get('/me', authMiddleware(), getMe);

userRoute.get('/doctors', getDoctors);
userRoute.get('/doctors/:id', getDoctorDetail);

userRoute.get('/:accountType', getUsersByType);
userRoute.post('/', createUser);
userRoute.delete('/', deleteUser);
userRoute.put('/', updateUser);

export { userRoute };
