import { Router } from 'express';
import { createBooking, verifyBooking } from './booking.controller';

const bookingRoute = Router();

bookingRoute.post('/', createBooking);
bookingRoute.post('/verify', verifyBooking);

export { bookingRoute };
