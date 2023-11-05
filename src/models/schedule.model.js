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

        // giờ hẹn được admin chỉ định
        time: {
            type: Array,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const scheduleModel = model('schedules', scheduleSchema);
