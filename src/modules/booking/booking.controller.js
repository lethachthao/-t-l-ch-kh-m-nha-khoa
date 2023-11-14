import mongoose from 'mongoose';
import { bookingModel } from '../../models/booking.model';
import { registryToken, verifyToken } from '../../utils/token';
import { sendMail } from '../mailer/mailer.controller';
import moment from 'moment';
import ApiError from '../../utils/api-error';

const { ObjectId } = mongoose.Types;

export const createBooking = async (req, res, next) => {
    const { date, startTime, endTime } = req.body;

    const isBooked = await bookingModel.findOne({
        startTime,
        endTime,
        date: {
            $gte: moment(new Date(date)).format(),
            $lt: moment(new Date(date)).add(1, 'd').format(),
        },
    });

    if (isBooked) {
        return next(
            new ApiError(
                409,
                'Thời gian đặt không khả dụng! Vui lòng chọn thời gian khác.',
            ),
        );
    }

    const result = await bookingModel.create(req.body);

    await result.populate('doctorId');

    const token = registryToken({ bookingId: result._id }, { expiresIn: '2h' });

    await sendMail(
        {
            title: 'Xác nhận lịch đặt khám',

            // prettier-ignore
            html: `<b>Cảm ơn bạn đã đặt lịch khám tại iTooth!</b> <br/>

                   <b>Mã đơn của bạn là: </b> <span style="font-size: 25px; font-weight: bold; color: red">${result._id}</span><br/>
                   <b>Người đặt đơn: </b> <span>${result.name}</span><br/>
                   <b>Địa chỉ: </b> <span>${result.address}</span><br/>
                   <b>Email: </b> <span>${result.email}</span><br/>
                   <b>Số điện thoại: </b> <span>${result.phoneNumber}</span><br/>
                   <b>Phương thức thanh toán: </b><span>${result.payment === 'cash' ? 'Tiền mặt (Thanh toán sau khi khám)':'Thẻ ngân hàng'}</span><br/>

                   <hr/>

                   <h3>Thông tin bác sĩ phụ trách</h3><br/>

                   <b>Bác sĩ: </b><span>${result.doctorId.name}</span><br/>
                   <b>Email: </b><span>${result.doctorId.email}</span><br/>
                   <b>Số điện thoại: </b><span>${result.doctorId.phoneNumber}</span><br/>
                   <b>Địa chỉ: </b><span>${result.doctorId.address}</span><br/>


                   <p style="color: green">Bạn vui lòng đến điểm hẹn <b>${result.doctorId.address}</b> vào ngày ${moment(result.date).format('DD/MM/YYYY')} / ${result.startTime} - ${result.endTime} để khám bệnh!</p><br/>

                   <p>Vui lòng xác nhận đơn đặt khám của bạn bằng cách nhấp vào liên kết bên dưới. Lưu ý: Liên kết xác nhận sẽ có hiệu lực tối đa trong 2 giờ để từ thời điểm bạn đặt lịch khám.</p> <br/>

                   <a href="http://localhost:3000/verify-booking/${token}">Nhấp vào đây để xác nhận</a>

            `,
            to: {
                name: result.name,
                email: result.email,
            },
        },
        () => {
            console.log('Đã gửi email xác nhận đơn đặt!');
        },
    );
    res.status(200).json({ message: 'Đặt lịch khám thành công' });
};

export const verifyBooking = async (req, res, next) => {
    const { token } = req.query;

    const data = verifyToken(token);

    if (!data) {
        return res.status(401).json({ message: 'Xác thực không thành công!' });
    }

    const { bookingId } = data;

    await bookingModel.findByIdAndUpdate(bookingId, { isVerified: true });

    res.status(200).json({ messsage: 'Xác thực thành công!' });
};

export const getBookings = async (req, res, next) => {
    const { userId } = req.auth;
    const { date } = req.query;

    let result = await bookingModel
        .find({
            doctorId: new ObjectId(userId),
            date: {
                $gte: moment(new Date(date)).format(),
                $lt: moment(new Date(date)).add(1, 'd').format(),
            },

            // ở đây mình chỉ lấy ra những cái đơn booking nào mà bệnh nhân đã xác nhận thông qua link gửi trong email
            // đề phòng người ta spam bác sĩ đơn ảo
            isVerified: true,

            // đồng thời chỉ lấy ra những đơn bác sĩ chưa xuất hóa đơn và chưa xác nhận, tức là chỉ lấy những đơn mới khám nhưng chưa có bill
            confirmedAt: null,
        })
        .populate('doctorId');

    res.status(200).json({ data: result });
};
