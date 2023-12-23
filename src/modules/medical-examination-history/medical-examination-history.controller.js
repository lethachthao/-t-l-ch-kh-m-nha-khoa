import { bookingModel } from '../../models/booking.model';
import { catchAsync } from '../../utils/catch-async';

export const getMedicalExaminationHistory = catchAsync(
    async (req, res, next) => {
        const { email } = req.query;

        const filters = {};

        if (email) {
            filters.email = email;
        }

        const result = await bookingModel
            .aggregate()
            .match(filters)
            .lookup({
                from: 'users',
                localField: 'doctorId',
                foreignField: '_id',
                as: 'doctor',
                pipeline: [
                    {
                        $project: {
                            password: 0,
                            role: 0,
                            accountType: 0,
                            createdAt: 0,
                            updatedAt: 0,
                        },
                    },
                ],
            })
            .unwind({
                path: '$doctor',
                preserveNullAndEmptyArrays: true,
            })
            .lookup({
                from: 'bills',
                localField: '_id',
                foreignField: 'bookingId',
                as: 'bill',
            })
            .unwind({
                path: '$bill',
                preserveNullAndEmptyArrays: true,
            });

        res.status(200).json({ data: result });
    },
);
