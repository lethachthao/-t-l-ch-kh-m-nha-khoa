import mongoose from 'mongoose';

// MODEL SCHEMA BILL

const { Schema, model } = mongoose;

const billSchema = new Schema(
    {
        // id bệnh nhân
        patientId: {
            type: Schema.Types.ObjectId, // ID của bệnh nhân là một object id của mongodb, nó không phải string
            ref: 'users', // tham chiếu đến user model collection để sau này join qua user
            required: true,
            index: true,
        },
        //id bác sĩ phụ trách khám,
        assignee: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            index: true,
        },

        // tình trạng bệnh
        medical_condition: {
            type: String,
            required: true,
            trim: true,
        },

        // đơn thuốc
        prescription: {
            type: String,
            required: true,
            trim: true,
        },

        // viện phí
        hospital_fee: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const billModel = model('bills', billSchema);
