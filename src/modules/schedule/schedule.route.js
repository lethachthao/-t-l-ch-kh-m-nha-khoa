import { Router } from 'express';
import {
    addSchedule,
    getSchedules,
    getSchedule,
    deleteSchedule,
    updateSchedule,
} from './schedule.controller';

const scheduleRoute = Router();

scheduleRoute.get('/', getSchedules);
scheduleRoute.get('/:id', getSchedule);
scheduleRoute.post('/', addSchedule);
scheduleRoute.delete('/:id', deleteSchedule);
scheduleRoute.put('/:id', updateSchedule);
export { scheduleRoute };
