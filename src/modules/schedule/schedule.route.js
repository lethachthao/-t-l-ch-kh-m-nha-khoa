import { Router } from 'express';
import { addSchedule } from './schedule.controller';

const scheduleRoute = Router();

scheduleRoute.post('/', addSchedule);

export { scheduleRoute };
