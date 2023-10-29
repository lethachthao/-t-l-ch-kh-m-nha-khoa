import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import mongoose from 'mongoose';
import ApiError from '../utils/api-error';

// nó là một error convert middleware nên tham số nó nhận y hệt thằng errorHandlerMiddleware bên dưới
export const errorConverterMiddleware = (err, req, res, next) => {
    let error = err;

    // nếu lỗi này ko phải là lỗi đến từ ApiError custom của mình thì lỗi này là lỗi ko xác định
    // còn cái ApiError này thì sao? ko phải tự nhiên nó có, mà là do mình chủ động tạo ra

    if (!(error instanceof ApiError)) {
        // nếu lỗi này trước đó có tồn tại hoặc nó là lỗi của mongosse thì trả về BAD_REQUEST 400, ngược lại ngoài hai thằng đó thì cho nó INTERNAL SERVER ERRO 500
        let statusCode =
            error.statusCode || error instanceof mongoose.Error
                ? StatusCodes.BAD_REQUEST
                : StatusCodes.INTERNAL_SERVER_ERROR;

        // nếu lỗi đó ko có message từ trước thì sẽ dùng message mặc định là messgae của lỗi đó, để biết về message đó em có thể xem trong doc: https://www.npmjs.com/package/http-status-codes
        let message = error.message || getReasonPhrase(statusCode);

        error = new ApiError(statusCode, message, false, err?.stack);
    }

    // convert xong thì chuyển tiếp cái error qua bên errorHandlerMiddleware xử lí
    next(error);
    // em hông hiểu chổ nào ko ạ?
    //cái dòng 19 anh nói cho em vơi , oke em

    // dòng error = new ApiError(statusCode, message, false, err?.stack)  sau khi error đó lọt vào câu if thì chúng ta đã xác định được error đó là một error ko xác định (tức ko phải error từ ApiError của chúng ta kiểm soát), cho nên chúng ta sẽ apply nó vào ApiError của chúng ta và đối số thứ 3 (statusCode, message, false, err?.stack) được truyền vào false. nó chính là cái đối số dành cho isInternal (nghĩa là mình xác định đây là lỗi ko xác đinh và ko do mình quản lí nhưng mình vẫn xử lí nó).
    // là vậy đó em, em hiểu chưa aạ?dạ ok rồi ạ
    // ko xóa comemnt code nha em, để nữa nhớ cho dễ vâng ạ
};

// khai báo middleware để xủ lí error đơn giản như này, middleware này sẽ nhận 4 tham số lần lượt là error, request, response và cuối cùng là next

export const errorHandlerMiddleware = (err, req, res, next) => {
    // lấy ra các thông tin về lỗi, status code là mã lỗi, message là dòng chữ lỗi, isInternal đó là lỗi được mình kiểm soát từ trước thường là lỗi do api, stack là chi tiết về lỗi cũng như nơi xảy ra lỗi ở đâu
    // cái biến isInternal nó là cái biến nội bộ do mình thêm vào để check xác định coi lỗi đó đến từ mình hay từ thư viện bên thứ 3.
    // ko phải tự nhiên mà nó có, mình cần phải nó một middleware khác làm nhiệm vụ phân tích và convert nó qua middleware này

    let { statusCode, message, isInternal, stack } = err;

    // nếu ở production env có xảy ra lỗi không xác định nào đó (có thể là lỗi từ cái thư viện mình dùng chẳng hạn) thì mặc định lấy lỗi đó là lỗi 500 INTERNAL_SERVER_ERROR
    if (process.env.NODE_ENV === 'production' && !isInternal) {
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR; // 500
        message = getReasonPhrase(statusCode); // Internal Server Error
    }

    // nếu ở môi trường local dev thì sẽ console thêm cái error để biết lỗi ở đâu để  xử lí và đồng thời trả về lỗi đó
    if (process.env.NODE_ENV === 'development') {
        console.log('ERROR: ', err);
    }

    res.status(statusCode || 500).json({ code: statusCode, message });
};

// có chổ nào ko hiểu ko em ơi anh nói cho em dòng 20 ạ cái đó là trả về sta
// dòng 20 là trả về cho user một cái json chứa thông tin về lỗi bao gồm mã lỗi (error code) và message của lỗi
//tại vì đây là middleware xử lí lỗi và trả về cho user như bao cái route thông thường khác thôi em production cái đó nó là của môt trường production đúng ko ạ
// đúng rồi em, chúng ta có cách xử lí lỗi ở trên production là luôn luôn KHÔNG CHO người khác biết lỗi đó là lỗi gì và nó đến từ đâu.
// bởi vì sao? bởi vì nó có thể giúp bảo mật hơn phần nào, nếu có bị hacker vào thăm web thì nó gặp cái lỗi chung chung là internal server error đó nó chẳng biết lỗi đó là nguyên nhân gì gây ra cả và cũng ko có thông tin gì nhiều
// em hiểu chưa? dạ em hiểu rồi, yep, xuyên suốt quá trình làm project mình cũng có tập chung vào bảo mật luôn nha em để có thêm nhiều kiến thức về nó dạ vâng ạ
