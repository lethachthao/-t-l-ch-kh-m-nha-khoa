import mongoose from 'mongoose';

// MODEL SCHEMA LỊCH KHÁM BỆNH

const { Schema, model } = mongoose;

const appointmentSchema = new Schema(
    {
        // id bệnh nhân
        patientId: {
            type: Schema.Types.ObjectId, // ID của bệnh nhân là một object id của mongodb, nó không phải string
            ref: 'users', // tham chiếu đến user model collection để sau này join qua user
            required: true,
            index: true,
        },

        time: {
            type: Date,
            required: false,
            default: Date.now,
        },

        // ghi chú cho lịch khám (dành cho bác sĩ)
        description: {
            type: String,
            required: false,
            trim: true,
        },

        // lí do khám bệnh
        reason: {
            type: String,
            required: true,
            trim: true,
        },

        // chi tiết số tiền thanh toán
        payment: {
            type: Schema.Types.ObjectId,
            ref: 'bills',
            required: false,
            index: true,
        },
    },
    {
        timestamps: true, // tự động thêm createdAt và updatedAt vào user document lúc tạo, createdAt và updatedAt là mốc thời gian tài khoản user được tạo
        versionKey: false, // loại bỏ thuộc tính __v (version key) ở đầu ra lúc query lấy data
    },
);

export const appointmentModel = model('appointments', appointmentSchema);
