import jwt from 'jsonwebtoken';

// đây là 2 hàm anh tách riêng, registryToken có nhiệm vụ là sign token từ data người dùng thành một chuỗi jwt
// verifyToken có nhiệm  vụ là xác thực cái jwt đó coi nó có hợp lệ hay còn sống ko
// trong đây em hiểu chưa, dạ rồi

/**
 * The function for registry token from data
 * registryToken có nhiệm vụ là sign token từ data người dùng thành một chuỗi jwt
 * @param {any} data
 * @param {object} options
 * @returns {string} - JWT
 */
export const registryToken = (data, options) => {
    // mặc định token có thời gian sống trong 1 giờ
    const { expiresIn } = options || {};

    return jwt.sign(data, process.env.JWT_SECRET_KEY, {
        expiresIn: expiresIn || process.env.JWT_ACCESS_TOKEN_EXPIRES_TIME,
    });
};

/**
 * verifyToken có nhiệm vụ là xác thực cái jwt đó coi nó có hợp lệ hay còn sống ko
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch {
        return null;
    }
};
