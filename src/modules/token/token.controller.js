import moment from 'moment';
import { registryToken as baseRegistryToken } from '../../utils/token';

/**
 * hàm này được anh cover lại cho đúng ngữ nghĩa với nó, hàm này được dùng nội bộ trong đây
 */
export const registryToken = (value) => {
    return baseRegistryToken(value);
};

/**
 * Function for generates token
 * @param {object | string | number} accessData
 * @param {object | string | number} refreshData
 * @returns {object}
 */
export const generateToken = (accessData, refreshData) => {
    // hash thông tin accessData & refreshData thành jwt từ hàm registryToken,
    // `expires` là property để trả về thời gian hết hạn dưới dạng unix time của từng token tương ứng
    // chi tiết về unix time: https://vi.wikipedia.org/wiki/Th%E1%BB%9Di_gian_Unix

    const response = {
        accessToken: {
            token: registryToken(accessData),
            // expires time của access token, convert sang unix time để gửi về cho user, sau này có một số case cần đụng đến expires time
            expires: moment()
                .add(
                    process.env.JWT_ACCESS_TOKEN_EXPIRES_TIME.replace(
                        /[^0-9]/g, // tách lấy số năm, vd: 1d => 1
                        '',
                    ),
                    'hour',
                )
                .toDate(),
        },

        refreshToken: {
            token: registryToken(
                refreshData,
                { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_TIME }, // thời hạn sống 1 năm, vì đây là refresh token nên chúng ta sẽ override cái expires mạc định trong hàm registryToken thành 1 năm
            ),

            expires: moment()
                .add(
                    process.env.JWT_REFRESH_TOKEN_EXPIRES_TIME.replace(
                        /[^0-9]/g, // tách lấy số năm, vd: 1y => 1
                        '',
                    ),
                    'year',
                )
                .toDate(),
        },
    };

    return response;
};

// em hiểu chưa ạ ở dạ ok rồi ạ. oke em
