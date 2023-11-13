import { billModel } from '../../models/bill.model';
import { bookingModel } from '../../models/booking.model';

export const createBill = async (req, res, next) => {
    const { bookingId } = req.body;
    const { path: billFile, filename: billName } = req.file;

    await billModel.create({
        bookingId,
        billName,
        billFile,
    });

    await bookingModel.findByIdAndUpdate(bookingId, {
        confirmedAt: new Date(),
    });

    res.status(200).json({ message: 'Tạo bill thành công!' });
};
