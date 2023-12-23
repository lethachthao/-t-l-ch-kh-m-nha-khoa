import { Router } from 'express';
import {
    createBooking,
    verifyBooking,
    getBookings,
    getMyBookings,
    getMyBookingsDetail,
} from './booking.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const bookingRoute = Router();

bookingRoute.get('/', authMiddleware(), getBookings);
bookingRoute.get('/my-bookings', authMiddleware(), getMyBookings);
bookingRoute.get('/my-bookings/:id', authMiddleware(), getMyBookingsDetail);

bookingRoute.post('/', authMiddleware(), createBooking);
bookingRoute.post('/verify', verifyBooking);

export { bookingRoute };
