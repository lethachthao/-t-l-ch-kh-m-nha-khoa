import mongoose from 'mongoose';
import { userModel } from '../../models/user.model';
import { sendMail } from '../mailer/mailer.controller';
const { ObjectId } = mongoose.Types;

export const getUsers = async (req, res, next) => {
    const result = await userModel.find({});
    res.status(200).json({ data: result });
};

export const getUsersByType = async (req, res, next) => {
    const { accountType } = req.params;

    const result = await userModel.find({ accountType });

    res.status(200).json({ data: result });
};

export const createUser = async (req, res, next) => {
    const { name, email } = req.body;

    const result = await userModel.create(req.body);
    await sendMail({
        title: 'Đăng kí thành công!',
        content: 'Cảm ơn bạn đã đăng kí tài khoản. Kính chào hẹn gặp lại',
        to: {
            name,
            email,
        },
    });
    console.log(req.body);
    res.status(200).json({ data: result });
};

export const deleteUser = async (req, res, next) => {
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
};

export const updateUser = async (req, res, next) => {
    const { _id, ...otherInfo } = req.body;

    const result = await userModel.findByIdAndUpdate(
        {
            _id: new ObjectId(_id),
        },
        otherInfo,
        {
            new: true,
        },
    );

    console.log(result);

    res.status(200).json({
        message: 'Cập nhật tài khoản thành công!',
        data: result,
    });
};
