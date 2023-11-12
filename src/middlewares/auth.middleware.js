import { expressjwt as jwt } from 'express-jwt';
import ApiError from '../utils/api-error';

export const authMiddleware = () => {
    return [
        jwt({ secret: process.env.JWT_SECRET_KEY, algorithms: ['HS256'] }),
        (err, req, res, next) => {
            if (err.name === 'UnauthorizedError') {
                throw new ApiError(
                    401,
                    'Xác thực người dùng không thánh công!',
                    true,
                );
            } else {
                next(err);
            }
        },
    ];
};
