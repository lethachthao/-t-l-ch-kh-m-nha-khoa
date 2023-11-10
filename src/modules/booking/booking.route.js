import { Router } from 'express';
import { createBooking } from './booking.controller';

const bookingRoute = Router();

bookingRoute.post('/', createBooking);

export { bookingRoute };
