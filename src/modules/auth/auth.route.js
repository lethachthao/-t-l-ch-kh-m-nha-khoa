import { Router } from 'express';
import { signinController } from './auth.controller';
import { signupController } from './auth.controller';

const authRoute = Router();

// đăng nhập
authRoute.post('/signin', signinController);

// đăng kí
authRoute.post('/signup', signupController);

export { authRoute };
