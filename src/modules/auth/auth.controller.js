import bcrypt from 'bcryptjs';
import ApiError from '../../utils/api-error';
import { getUserByEmail } from './auth.service';
import { generateToken } from '../token/token.controller';
import { userModel } from '../../models/user.model';
import { sendMail } from '../mailer/mailer.controller';
import { catchAsync } from '../../utils/catch-async';

export const signinController = catchAsync(async (req, res, next) => {
    // 1. lấy email, password người dùng gửi lên
    const { email, password } = req.body;

    // 2. check xem email có tồn tại trong database hay không

    // 3. nếu có tồn tại sẽ cấp cho người dùng một access token (jwt) và một refresh token (jwt)
    // access token sẽ có thời hạn 5 phút, và refresh token sẽ có thời hạn 1 năm
    // vì sao access token lại có thời gian ngắn?
    // để hạn chế thiệt hại với user nếu access tokoen của họ bị hack hoặc bị rò rỉ
    // còn refresh token thì sao?
    // refresh token là token gửi cùng với access token tới người dùng ở client sau kh đăng nhập thành công
    // refresh token để cấp cho user đó một access token mới nếu access token của user hết hạn
    // vậy nếu refresh token bị hack thì sao?
    // rất khó để phòng tránh trường hợp này, đồng nghĩa nếu refresh token bị hack thì hacker có quyền truy cập tài khoản đó của người dùng
    // nhưng nếu người dùng phát hiện sớm và đổi password , đồng nghĩa refresh token đó sẽ mất hiệu lực và hacker ko thể dùng được nữa

    const { existed: isEmailExisted, data: user } = await getUserByEmail(email);

    if (!isEmailExisted) {
        // khi truyền vào hàm next() một error thì ngay lập tức nó sẽ chạy đến error middleware và trả về lỗi cho user
        return next(new ApiError(404, 'Email không tồn tại'));
    }

    // à, user làm gì có password trong db mà so sánh =))
    // 4. So sánh password này với password trong database
    // Lưu ý: đối số thứ nhất `password` là pass do người dùng gửi lên
    const isSamePassword = bcrypt.compareSync(password, user.password);

    if (!isSamePassword) {
        return next(new ApiError(401, 'Sai mật khẩu'));
    }

    // hash thông tin user và generate access & refresh token
    const data = generateToken(
        { userId: user._id, role: user.role, email: user.email },
        { userId: user._id },
    );

    res.status(200).json(data);
});

export const signupController = catchAsync(async (req, res, next) => {
    // lưu ý: tất cả các thông tin này đều cần được validate bởi một middleware khác trước khi lọt được vào đây

    const {
        email,
        name,
        bio,
        birthday,
        gender,
        phoneNumber,
        password,
        accountType = 'user',
        role = 'user',
        address,
    } = req.body;

    const { path: avtPath, filename: avtName } = req.file || {};

    const { existed, data: user } = await getUserByEmail(email);

    if (existed) {
        // 409 là status code xử  lí Conflict. xem thêm: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
        return next(
            new ApiError(409, 'Email đã tồn tại, vui lòng chọn email khác!'),
        );
    }

    // hash password bằng bcrypt trước khi tạo user thêm vào database
    const passwordSalt = bcrypt.genSaltSync(10); // độ dài hàm băm để thuật toán bcrypt generate ra chuỗi hash
    const passwordHashed = bcrypt.hashSync(password, passwordSalt); // mã hóa password người dùng

    await userModel.create({
        name,
        email,
        ...(bio && { bio }),
        phoneNumber,
        password: passwordHashed,
        accountType,
        address,
        ...(birthday && { birthday }),
        ...(gender && { gender }),
        ...(avtName &&
            avtPath && {
                avatar: {
                    filename: avtName,
                    path: avtPath,
                },
            }),
        role,
    });

    //gửi mail
    const configMail = {
        title: 'Đăng kí thành công!',
        content:
            'Cảm ơn bạn đã đăng kí và tin tưởng sử dụng dịch vụ khám bệnh tại iTooth. Chúc bạn một ngày tốt lành!',
        to: {
            name,
            email,
        },
    };

    await sendMail(configMail, (isSuccess, data) => {
        if (isSuccess) {
            console.log('Gửi email thành công!');
        } else {
            console.log('Gửi email không thành công! Lỗi: ', data);
        }
    });

    res.status(200).json({ message: 'Tạo tài khoản thành công!' });
});
