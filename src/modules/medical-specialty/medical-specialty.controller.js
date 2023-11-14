import mongoose from 'mongoose';
import { medicalSpecialtyModel } from '../../models/medical-specialty.model';
const { ObjectId } = mongoose.Types;

export const getMedicalSpecialty = async (req, res, next) => {
    const result = await medicalSpecialtyModel.find({});
    res.status(200).json({ data: result });
};

export const getMedicalSpecialtyDetail = async (req, res, next) => {
    const { id } = req.params;

    const [result] = await medicalSpecialtyModel
        .aggregate()
        .match({ _id: new ObjectId(id) })
        .lookup({
            from: 'users',
            localField: 'members',
            foreignField: '_id',
            as: 'members',
            pipeline: [
                {
                    $project: {
                        password: 0,
                    },
                },
            ],
        });

    res.status(200).json({ data: result });
};

export const topSpecialist = async (req, res, next) => {
    const result = await medicalSpecialtyModel
        .aggregate()
        .match({})
        .sample(10)
        .project({
            members: 0,
        });

    res.status(200).json({ data: result });
};

export const createMedicalSpecialty = async (req, res, next) => {
    // lấy ra các fields từ frontend admin tạo và gửi qua đây
    const { name, description, members } = req.body;
    const { filename, path } = req.file;

    const result = await medicalSpecialtyModel.create({
        name,
        description,
        members,
        avatar: {
            filename,
            path,
        },
    });

    res.status(200).json({
        message: 'Tạo chuyên khoa thành công!',
        data: result,
    });
};

export const updateMedicalSpecialty = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, members } = req.body;
    const { filename, path } = req.file || {};

    const isIncludeFile = Boolean(req.file);

    const result = await medicalSpecialtyModel.findByIdAndUpdate(
        id,
        {
            name,
            description,
            ...(isIncludeFile
                ? {
                      avatar: {
                          filename,
                          path,
                      },
                  }
                : {}),
            members,
        },
        { new: true },
    );

    res.status(200).json({
        message: 'Cập nhật chuyên khoa thành công!',
        data: result,
    });
};

export const deleteMedicalSpecialty = async (req, res, next) => {
    const { id } = req.params;

    await medicalSpecialtyModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Xóa chuyên khoa thành công!' });
};
