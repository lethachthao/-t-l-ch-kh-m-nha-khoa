import mongoose from 'mongoose';
import { userModel } from '../../models/user.model';
import { sendMail } from '../mailer/mailer.controller';
import { scheduleModel } from '../../models/schedule.model';
import { specialistLookup } from './user.pipeline';
import { catchAsync } from '../../utils/catch-async';
const { ObjectId } = mongoose.Types;

export const getUsers = catchAsync(async (req, res, next) => {
    const result = await userModel.find({});
    res.status(200).json({ data: result });
});

export const getMe = catchAsync(async (req, res, next) => {
    const { userId } = req.auth;
    const result = await userModel.findOne({ _id: new ObjectId(userId) });

    if (!result) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ data: result });
});

export const getUsersByType = catchAsync(async (req, res, next) => {
    const { accountType } = req.params;

    const result = await userModel.find({ accountType });

    res.status(200).json({ data: result });
});

export const getDoctors = catchAsync(async (req, res, next) => {
    const result = await userModel
        .aggregate()
        .match({ accountType: 'doctor' })
        .lookup(specialistLookup)
        .project({
            role: 0,
            accountType: 0,
            password: 0,
            createdAt: 0,
            updatedAt: 0,
        });

    res.status(200).json({ data: result });
});

export const createUser = catchAsync(async (req, res, next) => {
    const { path: avatar } = req.file;

    const result = await userModel.create({ ...req.body, avatar });

    // await sendMail({
    //     title: 'Đăng kí thành công!',
    //     content: 'Cảm ơn bạn đã đăng kí tài khoản. Kính chào hẹn gặp lại',
    //     to: {
    //         name,
    //         email,
    //     },
    // });

    res.status(200).json({ data: result });
});

export const deleteUser = catchAsync(async (req, res, next) => {
    // lấy ra email account cần xóa từ query trên URL
    // DELETE: localhost:3001/api/user?email=abc@gmail.com
    //giai thich cho em query voi
    // nó là cái "user?email=abc@gmail.com" nè em, khi bên frontend gửi qua 1 request với URL như vậy để xóa thì cái user?email=abc@gmail.com được coi là một query parameters
    // đây chúng ta log ra xem thử nha
    // đây { email: 'benhnhan2@gmail.com' } chính là cái query object của chúng ta đó, từ user?email=abc@gmail.com nó auto chuyển thành { email: '...' } để chúng ta dễ dàng truy cập đến cái email đó, da vang
    // em hiểu chưa, da roi a
    const { email } = req.query;

    const result = await userModel.findOneAndDelete({ email });

    res.status(200).json({
        message: 'Xóa tài khoản thành công!',
        data: result,
    });
});

export const updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const otherInfo = req.body;
    const avatar = req.file;

    const result = await userModel.findByIdAndUpdate(
        {
            _id: new ObjectId(id),
        },
        {
            ...otherInfo,
            ...(avatar && {
                avatar: {
                    path: avatar.path,
                    filename: avatar.filename,
                },
            }),
        },
        {
            new: true,
        },
    );

    console.log(result);

    res.status(200).json({
        message: 'Cập nhật tài khoản thành công!',
        data: result,
    });
});

export const getDoctorDetail = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const [result] = await userModel
        .aggregate()
        .match({ _id: new ObjectId(id) })
        .lookup(specialistLookup)
        .project({
            role: 0,
            accountType: 0,
            password: 0,
            updatedAt: 0,
        });

    res.status(200).json({ data: result });
});

export const topDoctors = catchAsync(async (req, res, next) => {
    const result = await userModel
        .aggregate()
        .match({ accountType: 'doctor' })
        .sample(10)
        .lookup(specialistLookup)
        .project({
            role: 0,
            accountType: 0,
            password: 0,
            createdAt: 0,
            updatedAt: 0,
        });

    res.status(200).json({ data: result });
});
