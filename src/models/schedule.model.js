import mongoose from 'mongoose';

// LỊCH TRÌNH

const { Schema, model } = mongoose;

const scheduleSchema = new Schema(
    {
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: 'users', // join đến bác sĩ
            required: true,
            index: true,
        },

        // ngày hẹn được admin chỉ định
        date: {
            type: Date,
            required: true,
        },

        // giờ hẹn được admin chỉ định, cái mà em bảo check là khi user 1 dặt lịch lúc 8-9h ngày 11/11 rồi thì user 2 sẽ không thể đặt được giờ đó vào ngày đó á
        time: [
            {
                start: {
                    type: String,
                    required: false,
                },
                end: {
                    type: String,
                    required: false,
                },
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const scheduleModel = model('schedules', scheduleSchema);
