import mongoose from 'mongoose';
import { medicalSpecialtyModel } from '../../models/medical-specialty.model';
const { ObjectId } = mongoose.Types;

export const getMedicalSpecialty = async (req, res, next) => {
    const result = await medicalSpecialtyModel.find({});
    res.status(200).json({ data: result });
};

export const createMedicalSpecialty = async (req, res, next) => {
    // lấy ra các fields từ frontend admin tạo và gửi qua đây
    const { name, description } = req.body;

    const result = await medicalSpecialtyModel.create({
        name,
        description,
    });

    res.json(200).json({
        message: 'Tạo chuyên khoa thành công!',
        data: result,
    });
};

export const updateMedicalSpecialty = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, members } = req.body;

    const result = await medicalSpecialtyModel.findOneAndUpdate(
        {
            _id: new ObjectId(id),
        },
        { name, description, members },
        { new: true },
    );

    res.json(200).json({
        message: 'Cập nhật chuyên khoa thành công!',
        data: result,
    });
};
