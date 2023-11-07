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

export const getSchedules = async (req, res, next) => {
    const result = await scheduleModel
        .aggregate()
        .match({})
        .lookup({
            from: 'users',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctor',
        })
        .unwind({
            path: '$doctor',
        })
        .project({
            doctorId: 0,
            'doctor.password': 0,
            'doctor.role': 0,
        });
    res.status(200).json({ data: result });
};

export const deleteSchedule = async (req, res, next) => {
    const { id } = req.params;

    await scheduleModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Xóa lịch trình thành công' });
};

export const updateSchedule = async (req, res, next) => {
    const { id } = req.params;

    const result = await scheduleModel.findByIdAndUpdate(id, req.body);

    res.status(200).json({
        message: 'Cập nhật lịch trình thành công',
        data: result,
    });
};
