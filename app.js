import path from 'path';
import dotenv from 'dotenv';

// load file env theo môi trường process.env.NODE_ENV, ví dụ .env.development hoặc .env.production
// process.env.NODE_ENV sẽ phụ thuộc vào config bên trong script package.json

/**
 * path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
 * cái này nó sẽ lấy cái file .env.xxx phụ thuộc vào cái value của NODE_ENV anh set bên trong package.json => script dev đó em
 * ví dụ anh run npm run dev thì lúc này `set NODE_ENV=development` cái biến NODE_ENV đang là development
 * nên nó sẽ load file .env.development để lấy các biến môi trường trong đó sử dụng cho project ở local dev
 *  em hiểu chưa? à em hiểu rồi ạ hehe note lại
 */
dotenv.config({
    path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
});

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import { db } from './src/configs/database';
import {
    errorConverterMiddleware,
    errorHandlerMiddleware,
} from './src/middlewares/error.middleware';
import { routes } from './src/routes';

const app = express();

// apply helmet vào express app để nó bảo mật http headers. https://www.npmjs.com/package/helmet
app.use(helmet());

// parse body gửi từ client về thành object để mình có thể sử dụng và truy cập được vào body, giới hạn tối đa của body là 30kb, neu1 vượt quá sẽ báo lỗi về người dùng biết
app.use(bodyParser.json({ limit: '30kb' }));

// parse urlencoded gửi về từ body, cho phép giới hạn tối đa là 100 params, extends: true có nghĩa là mình sẽ sử dụng parser của qs thay vì querystring mặc định của bodyparser
app.use(bodyParser.urlencoded({ parameterLimit: 100, extended: true }));

app.use(cors());
// apply cors cho tất cả các request có method là OPTIONS
app.options('*', cors());

// prevent response status trả về 304 (not modified), luôn luôn trả về status 200 nếu response status đó thành công
app.disable('etag');

// lọc ra những cái kí tự lạ do hacker cố tình chèn vào request để tấn công database mongodb, trong mongodb các kí tự như $, mongo nó hiểu là một toán tử, nếu ko lọc nó sẽ thực thi toán tử đó, có thể dẫn tới database bị hack
// em hiểu về cái này chưa ạ? anh nói em cũng hiểu sơ qua rồi có gì về em sẽ tìm hiểu thêm, oke em nói chung cái này chỉ dùng để filter (lọc) các kí tự đầu vào của user gửi lên
app.use(mongoSanitize());

// filter những cái script nếu ai đó cố tình chèn vào nhằm mục đích tấn công xss web của mình. ví dụ: user gửi lên \<script>alert();</script> nó sẽ chèn thêm kí tự \ ngòa trước hoặc remove luôn trước khi them6 vào database. Ví dụ: doạn script lúc nãy sẽ thành \<script\>alert();\<\/script\>
app.use(xss());

// filter ra những params có key trùng nhau để tránh dẫn đến lỗi server, trong express nếu có tình truyền vào hai params giống nhau trở lên nó sẽ auto chuyển thành một array chứa 2 params đó, nhưng express nó dùng hàm trim() trong js để trim loại bỏ khoảng trắng trong chuỗi hoặc các hàm hỗ trợ cho string liên quan. nên array sẽ ko có method nào tên là trim() vì vậy sẽ gây ra lỗi cho server
// em hiểu chưa ạ? vâng ạ
app.use(hpp());

// apply tất cả các routes đã khai báo
app.use('/api', routes);

app.use((req, res, next) => {
    const err = new Error('Page not found');
    next(err);
});

// xử lí lỗi trong express
// lỗi trong express nodejs nó là một dạng middleware
// thông thường 1 hệ thống nào hoạt động cũn phải có sinh ra lỗi, lúc có lỗi thì server cần phải xử lí những cái lỗi đó
// ví dụ khi người dùng requesst lên database chăng hạn, nếu database bị die thì lỗi đó sẽ lọt vào middleware error này
// chúng ta sẽ khai báo error middleware ở cuối cùng vì theo như flow hoạt động của expressjs thì, nó sẽ duyệt qua từng route từng middleware, nếu trong quá trình đó có lỗi thì thay vì MANG TIỀN VỀ CHO MẸ như đen vâu, thì express sẽ mang lỗi này về cho error middleware xử lí sau cùng. em hình dung chưa ạ? em cũng hiểu sơ thôi ạ
// oke em, vào thực hành để hiểu luôn chắc ăn

// anh sẽ tách cái này ra để vào folder middlewares cho gọn

// ông này sẽ nhiệm vụ chuyển lỗi không xác định sang cho ông dưới xử lí
app.use(errorConverterMiddleware);

// ông này sẽ xử lí và trả về user, mỗi ông 1 nhiệm vụ
app.use(errorHandlerMiddleware);

let server;

db().then(() => {
    console.log('Connected to MongoDB!');

    server = app.listen(3001, () => {
        console.log('Server listening on port 3001');
    });
});

// khi nodejs app chúng ta xảy ra lỗi, nó sẽ hủy tất cả các tác vụ đang thực thi trong process
const killProcessAndServer = (error) => {
    // log ra thông tin lỗi
    console.error(error);

    // nếu server đang starrt thì close server
    if (server) {
        server.close(() => {
            console.log('Server closed!');
        });
    }

    // force the process to exit as quickly as possible even if there are still asynchronous operations pending that have not yet completed fully
    // cái này lên nâng cao anh sẽ nói thêm về này nha, tại đây là kiến thức sâu hơn nữa. dạ vâng
    process.exit(1);
};

process.on('uncaughtException', killProcessAndServer);
process.on('unhandledRejection', killProcessAndServer);

// rồi mai học tiếp em ha dạ vâng ạ.
// qua zalo nhắn xíu em
