import mongoose from 'mongoose';
import { medicalSpecialtyModel } from '../../models/medical-specialty.model';
import { catchAsync } from '../../utils/catch-async';
const { ObjectId } = mongoose.Types;

//Lấy tất cả chuyên khoa
export const getMedicalSpecialty = catchAsync(async (req, res, next) => {
    const result = await medicalSpecialtyModel.find({});
    res.status(200).json({ data: result });
});

//Chi tiết chuyên khoa
export const getMedicalSpecialtyDetail = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const [result] = await medicalSpecialtyModel //medicalSpecialtyModel.aggregate() trả về một mảng lên sử dụng [result]
        .aggregate() // sử dụng aggregate để thực hiện một chuỗi biến đổi dữ liệu trong cllection
        .match({ _id: new ObjectId(id) }) //lọc id chuyên khoa sao cho '_id phải bằng id được chuyền vào', Tìm id chính xác thay vì dùng findOne
        .lookup({
            //lookup thực hiện phép nối (join) giữa 2 bảng medicalSpecialtyModel và user
            from: 'users', //tên collection muốn nối tới(data truy vấn đến)
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
});

export const topSpecialist = catchAsync(async (req, res, next) => {
    const result = await medicalSpecialtyModel
        .aggregate() //phương thức aggregate thay find để thực hiện biến đổi trên cơ sở dữ liệu và lấy dữ liệu
        .match({}) //Lọc các tài liệu trên điều kiện đc đưa ra {} Rỗng
        .sample(10) //lấy ngẫu nhiên 10 chuyên khoa
        .project({
            members: 0,
        });

    res.status(200).json({ data: result });
});

export const createMedicalSpecialty = catchAsync(async (req, res, next) => {
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
});

export const updateMedicalSpecialty = catchAsync(async (req, res, next) => {
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
});

export const deleteMedicalSpecialty = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    await medicalSpecialtyModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Xóa chuyên khoa thành công!' });
});
