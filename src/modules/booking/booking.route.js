import { Router } from 'express';
import {
    createBooking,
    verifyBooking,
    getBookings,
} from './booking.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const bookingRoute = Router();

bookingRoute.get('/', authMiddleware(), getBookings);
bookingRoute.post('/', createBooking);
bookingRoute.post('/verify', verifyBooking);

export { bookingRoute };
