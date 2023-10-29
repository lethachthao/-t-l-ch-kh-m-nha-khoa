import mongoose from 'mongoose';

export const db = () =>
    mongoose.connect(process.env.MONGODB_URL, {
        autoCreate: true, // auto tạo collection mongo mỗi khi connect thành công
        dbName: 'itooth', // chọn tên database cho mongo
    });
