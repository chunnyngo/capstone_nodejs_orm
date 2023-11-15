import jwt from "jsonwebtoken"

// tao ra token
const createToken = (data) => {
    let token = jwt.sign({ data }, "KHOABIMAT", {
        algorithm: "HS256",
        expiresIn: "5d",
    }); // HS256
    return token;
};
// kiểm tra token
const checkToken = (token) => {
    try {
        // Thử giải mã token sử dụng khóa bí mật (secret key)
        const decodedToken = jwt.verify(token, "KHOABIMAT");

        // Nếu giải mã thành công, token hợp lệ
        return true;
    } catch (error) {
        // Nếu có lỗi khi giải mã hoặc token không hợp lệ, trả về false
        return false;
    }
};
//  GIAI MA TOKEN
const decodeToken = (token) => {
    return jwt.decode(token);
};

export { createToken, checkToken, decodeToken };