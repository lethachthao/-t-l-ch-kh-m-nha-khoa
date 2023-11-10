import mongoose from 'mongoose';

// MODEL SCHEMA BOOKING

// ddress
// :
// "fdfdfdfdfdf"
// birthday
// :
// "10/11/2023"
// gender
// :
// "male"
// name
// :
// "sasasas"
// payment
// :
// "1"
// phoneNumuber
// :
// "323232323"
// reason
// :
// "fdfdfdfdf"

const { Schema, model } = mongoose;

const bookingSchema = new Schema(
    {
        // id bác sĩ
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            index: true,
        },

        date: {
            type: Date,
            required: true,
        },

        startTime: {
            type: String,
            required: true,
        },

        endTime: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },

        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },

        gender: {
            type: String,
            required: true,
        },

        birthday: {
            type: Date,
            required: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        reason: {
            type: String,
            required: true,
            trim: true,
        },

        payment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const bookingModel = model('bookings', bookingSchema);
