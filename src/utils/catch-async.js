/**
 * Hàm dùng để catch tất cả promise error và chuyển đến middleware error xử lí thay vì crash app
 */
export const catchAsync = (fn) => (req, res, next) => {
    const handlerResult = fn(req, res, next);

    Promise.resolve(handlerResult).catch((err) => next(err));
};
