// vì error trong javascript có nhiều kiểu nhưng chúng ta sẽ sử dụng error constructor
// em có thể đọc sơ tại: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Error
// nó là một constructor Error nên được khai báo bởi từ khóa `new`
// ở đây chúng ta sẽ tạo riêng cho chúng ta 1 ApiError constructor nó được thừa hưởng những method, instance properties từ Error constructor

class ApiError extends Error {
    constructor(statusCode, message, isInternal = true, stack = '') {
        /**
         * The super keyword is used to access properties on an object literal or class's [[Prototype]], or invoke a superclass's constructor.
         * The super.prop and super[expr] expressions are valid in any method definition in both classes and object literals. The super(...args) expression is valid in class constructors.
         *
         * Em có thể hiểu đơn giản nó là một từ khóa để thằng Error có thể sử dụng, vì thằng Error bản thân nó nhận vào một cái message
         * ví dụ: new Error('message here');
         * cho nên khi dùng từ khóa super(message) tức là truyền cho thằng Error cái message làm đối số mặc định, và ApiError cũng sẽ thừa hưởng luôn cái message đó
         * em hiểu chưa ạ? dạ rồi ạ xong phần này mình nghỉ nha anh
         */

        super(message);

        this.statusCode = statusCode;
        this.isInternal = isInternal;

        if (stack) {
            this.stack = stack;
        } else {
            // nếu ko truyền gì nào stack thì stack sẽ tự tạo ra
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;

// em có gì ko hiểu ko ạ? super từ khóa này là gì v ạ
