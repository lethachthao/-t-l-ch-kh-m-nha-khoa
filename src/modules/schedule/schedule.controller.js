import mongoose from 'mongoose';
import moment from 'moment';
import { scheduleModel } from '../../models/schedule.model';
import { catchAsync } from '../../utils/catch-async';
const { ObjectId } = mongoose.Types;

export const addSchedule = catchAsync(async (req, res, next) => {
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
});

export const getSchedules = catchAsync(async (req, res, next) => {
    const result = await scheduleModel
        .aggregate()
        .match({})
        // lookup là một hàm nằm trong aggregate là hàm dùng để join truy vấn giữa các collection với nhau đối với các dữ liệu cần quan hệ truy vấn
        .lookup({
            from: 'users', // join tới collection users
            localField: 'doctorId', // lấy field "doctorId" từ collection "schedules" làm khóa của schedules
            foreignField: '_id', // lấy field "_id" từ collection "users" làm khóa của user
            as: 'doctor', // đặt tên biến cho kết quả sau khi thực hiện join. vậy á em. da vang em cung co timf hieu ve aggregate nay nhung cai nay hoi kho hieu len hoi anh oke em nó kiểu na ná INNER JOIN , OUTER JOIN bên sql, da vang em cam on a, khoan, để anh xem chổ nào còn tối ưu. mà em nhớ code kiểm tra cẩn thận nha vì đây là javascript nên sai 1 ly là lỗi luôn đó, nó ko báo lỗi trong quá trình mình code đâu nó chỉ có lỗi khi chạy code thôi, da vang
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
});

export const deleteSchedule = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    await scheduleModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Xóa lịch trình thành công' });
});

export const updateSchedule = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const result = await scheduleModel.findByIdAndUpdate(id, req.body);

    res.status(200).json({
        message: 'Cập nhật lịch trình thành công',
        data: result,
    });
});

export const getSchedule = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { date } = req.query;

    let [result] = await scheduleModel
        .aggregate()
        .addFields({
            dateParsed: {
                $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$date',
                },
            },
        })
        .match({
            doctorId: new ObjectId(id),

            dateParsed: {
                $gte: moment(new Date(date)).format('YYYY-MM-DD'),
                $lte: moment(new Date(date)).format('YYYY-MM-DD'),
            },
        })
        .lookup({
            from: 'bookings',
            pipeline: [
                {
                    $addFields: {
                        bookingDateParsed: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$date',
                            },
                        },
                    },
                },
                {
                    $match: {
                        doctorId: new ObjectId(id),
                        bookingDateParsed: {
                            $gte: moment(new Date(date)).format('YYYY-MM-DD'),
                            $lte: moment(new Date(date)).format('YYYY-MM-DD'),
                        },
                    },
                },
            ],
            as: 'bookingItems',
        })
        .project({
            dateParsed: 0,
        });

    if (!result) {
        return res.status(200).json({ data: [] });
    }

    result = {
        ...result,
        time: result.time.map((t) => {
            return {
                ...t,
                isDisabled: result.bookingItems.some(
                    (b) => b.startTime === t.start && b.endTime === t.end,
                ),
            };
        }),
    };

    res.status(200).json({ data: result });
});
