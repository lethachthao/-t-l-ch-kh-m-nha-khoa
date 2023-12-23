import mongoose from 'mongoose';

// MODEL SCHEMA BOOKING

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

        isVerified: {
            type: Boolean,
            required: false,
            default: false,
        },
        confirmedAt: {
            type: Date,
            required: false,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const bookingModel = model('bookings', bookingSchema);
