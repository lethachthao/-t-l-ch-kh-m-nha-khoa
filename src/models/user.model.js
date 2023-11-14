import mongoose from 'mongoose';
import validator from 'validator';

// MODEL SCHEMA USER (bệnh nhân, bác sĩ)

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },

        // giói thiệu (dành cho bác sĩ)
        bio: {
            type: String,
            required: false,
            trim: true,
            maxlength: 10000,
        },

        age: {
            type: Number,
            required: false,
        },

        avatar: {
            type: new Schema({
                filename: { type: String, required: true },
                path: { type: String, required: true },
            }),
            required: false,
        },

        phoneNumber: {
            type: String,
            required: true,
            trim: true,
            maxlength: 10,
        },

        gender: {
            type: String,
            required: false,
            enum: ['male', 'female', 'lgbt'], // giới tính user 1 trong 2 giá trị nam hoặc nữ hoặc đồng tính
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true, // chuyển hết sang chữ thường
            index: true, // đánh index để query nhanh hơn
            unique: true, // email phải là duy nhất không được trùng nhau
            validate: {
                // validate email, nếu ko phải email hợp lệ thì trả về lỗi với message "Invalid Email"
                validator: function (value) {
                    return validator.isEmail(value);
                },
                message: 'Invalid Email',
            },
        },

        password: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: false,
            trim: true,
        },

        accountType: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            required: true,
            enum: ['user', 'doctor', 'admin'], // role của user là 1 trong 3 giá trị này
            default: 'user',
        },
    },
    {
        timestamps: true, // tự động thêm createdAt và updatedAt vào user document lúc tạo, createdAt và updatedAt là mốc thời gian tài khoản user được tạo
        versionKey: false, // loại bỏ thuộc tính __v (version key) ở đầu ra lúc query lấy data
    },
);

/**
 * tạo phương thức tĩnh để check xem email có tồn tại trong db không?
 *  chúng ta có thể dùng nó ở bất cứ đâu mà ko cần viết đi viết lại logic này, ví dụ:
 *
 * @example
 * ```
 *   userModel.isEmailExisted(email); // ==> boolean
 * ```
 * @param {*} email
 * @returns
 */
userSchema.statics.isEmailExisted = async function (email) {
    const user = await this.findOne({ email }).lean(); // lean() là hàm để trả về kết quả là một javascript object thay vì mongo object, điều này cải thiện tốc độ truy vấn

    return { existed: Boolean(user), data: user };
};

export const userModel = model('users', userSchema);

// cơ bản cho bảng user như vậy là oke rồi nha em, em có gì ko hiểu ko, cái enum và trim là gì v anh
// enum chính là cái mảng mà user đó chỉ được phép chọn 1 cái duy nhất trong số đó, ví dụ user role chỉ có thể là "user" hoặc "dentist" hoặc "admin"
// trim là loại bỏ những cái khoảng trắng white space trong chuỗi đầu vào đó em, ví dụ: đầu vào là "  Nguyễn Văn Đen  ", nó sẽ convert thành "Nguyễn Văn Đen" dạ vâng em hiểu rồi ạ dạ vâng ạ
