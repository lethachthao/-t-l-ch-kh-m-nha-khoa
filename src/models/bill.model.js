import mongoose from 'mongoose';

// MODEL SCHEMA BILL

const { Schema, model } = mongoose;

const billSchema = new Schema(
    {
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'bookings',
            required: true,
            index: true,
        },

        billFile: {
            type: String,
            required: true,
        },

        billName: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const billModel = model('bills', billSchema);
