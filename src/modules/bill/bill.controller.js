import { billModel } from '../../models/bill.model';
import { bookingModel } from '../../models/booking.model';
import { sendMail } from '../mailer/mailer.controller';

export const createBill = async (req, res, next) => {
    const { bookingId } = req.body;
    const { path: billFile, filename: billName } = req.file;

    const result = await billModel.create({
        bookingId,
        billName,
        billFile,
    });

    const bookingResult = await bookingModel.findByIdAndUpdate(
        bookingId,
        {
            confirmedAt: new Date(),
        },
        { new: true },
    );

    await sendMail({
        to: {
            email: bookingResult.email,
            name: bookingResult.name,
        },
        title: 'Hóa đơn khám bệnh',
        html: `
        <p>Cảm ơn bạn đã đăng kí khám bệnh tại iTooth, chúng tôi đã gửi cho bạn một hóa đơn. Vui lòng liên hệ chúng tôi nếu cần thêm thông tin hỗ trợ.</p><br/>
        
        <a href="${billFile}" download>Tải xuống hóa đơn</a>
        `,
        attachments: [
            {
                filename: billName,
                path: billFile,
                cid: 'bill',
            },
        ],
    });

    res.status(200).json({ message: 'Tạo bill thành công!' });
};
