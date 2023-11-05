import mongoose from 'mongoose';

// MODEL SCHEMA CHUYÊN KHOA

const { Schema, model } = mongoose;

const medicalSpecialtySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        avatar: {
            type: new Schema({
                filename: { type: String, required: true },
                path: { type: String, required: true },
            }),
            required: true,
        },
        // bác sĩ trong chuyên khoa
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'users',
                required: false,
            },
        ],
    },
    {
        timestamps: true, // tự động thêm createdAt và updatedAt vào user document lúc tạo, createdAt và updatedAt là mốc thời gian tài khoản user được tạo
        versionKey: false, // loại bỏ thuộc tính __v (version key) ở đầu ra lúc query lấy data
    },
);

export const medicalSpecialtyModel = model(
    'medicalSpecialty',
    medicalSpecialtySchema,
);
