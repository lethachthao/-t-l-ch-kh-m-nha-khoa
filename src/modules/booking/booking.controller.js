import { bookingModel } from '../../models/booking.model';
import { sendMail } from '../mailer/mailer.controller';

export const createBooking = async (req, res, next) => {
    const result = await bookingModel.create(req.body);

    await sendMail(
        {
            title: 'Xác nhận lịch đặt khám',
            content:
                'Cảm ơn bạn đã đặt lịch khám tại iTooth, vui lòng xác nhận đơn đặt khám của bạn bằng cách nhấp vào liên kết bên dưới. Lưu ý: Liên kết xác nhận sẽ có hiệu lực tối đa trong 2 giờ để từ thời điểm bạn đặt lịch khám.',
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
