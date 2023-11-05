import { Router } from 'express';
import {
    createUser,
    getUsers,
    getUsersByType,
    deleteUser,
    updateUser,
} from './user.controller';

const userRoute = Router();

userRoute.get('/', getUsers);
userRoute.get('/:accountType', getUsersByType);
userRoute.post('/', createUser);
userRoute.delete('/', deleteUser);
userRoute.put('/', updateUser);

export { userRoute };
