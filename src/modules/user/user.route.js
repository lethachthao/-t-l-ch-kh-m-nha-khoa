import { Router } from 'express';
import { createUser, getUsers } from './user.controller';

const userRoute = Router();

userRoute.get('/', getUsers);
userRoute.post('/', createUser);

export { userRoute };
