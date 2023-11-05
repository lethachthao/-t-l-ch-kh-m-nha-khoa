import { scheduleModel } from '../../models/schedule.model';

export const addSchedule = async (req, res, next) => {
    const { doctor: doctorId, date, time } = req.body;

    const result = await scheduleModel.create({
        doctorId,
        date,
        time,
    });

    res.status(200).json({
        message: 'Tạo lịch trình thành công!',
        data: result,
    });
};
