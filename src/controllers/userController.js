import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import { createToken, decodeToken } from "../configs/jwt.js";
const prisma = new PrismaClient();

// register
export const userRegister = async (req, res) => {
    try {
        const { email, mat_khau, ho_ten, tuoi } = req.body

        // find user by email
        const userExist = await prisma.nguoi_dung.findFirst({
            where: { email: email }
        })
        if (userExist)
            return res.status(400).json({ message: "Người dùng đã tồn tại" }); // nếu người dùng đã tồn tại

        let passwordHash = bcrypt.hashSync(mat_khau, 10); // mã hoá password

        const newUser = await prisma.nguoi_dung.create({
            data: {
                email,
                mat_khau: passwordHash,
                ho_ten,
                tuoi
            }
        });
        res.status(200).json({
            message: "Đăng ký thành công",
            data: {
                full_name: newUser.full_name,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("register", error);

        res.status(400).json({
            message: "Đăng ký không thành công",
        });
    }
};
// login 
export const userLogin = async (req, res) => {
    try {
        const { email, mat_khau } = req.body;

        const userExist = await prisma.nguoi_dung.findFirst({
            where: { email: email }
        })
        if (!userExist)
            return res.status(400).json({ message: "Email không đúng" }); // nếu email chưa tồn tại

        let isPassword = bcrypt.compareSync(mat_khau, userExist.mat_khau); // kiểm tra password

        if (!isPassword)
            return res.status(400).json({ message: "Mật khẩu không đúng" }); // nếu password không đúng

        let token = createToken({
            nguoi_dung_id: userExist.nguoi_dung_id,
            ho_ten: userExist.ho_ten,
            email: userExist.email,
            tuoi: userExist.tuoi
        }); // tạo token

        res.status(200).json({
            message: "Đăng nhập thành công",
            data: {
                token,
            },
        });
    } catch (error) {
        console.error("login:", error);

        res.status(400).json({ message: "Xử lý không thành công" });
    }
};
//get user info
export const getUser = async (req, res) => {
    let { token } = req.headers
    const user = decodeToken(token)
    let { nguoi_dung_id } = user.data
    const userInfo = await prisma.nguoi_dung.findMany({
        where: { nguoi_dung_id }
    })
    res.send(userInfo)
}
// get image by user id
export const getImageByUserId = async (req, res) => {
    let { token } = req.headers
    const user = decodeToken(token)
    let { nguoi_dung_id } = user.data

    let lstImage = await prisma.hinh_anh.findMany({
        where: {
            nguoi_dung_id: parseInt(nguoi_dung_id, 10)
        },
        include: {
            luu_anh: {
                where: {
                    nguoi_dung_id: parseInt(nguoi_dung_id, 10)
                }
            }
        }
    })
    res.send(lstImage)

}
// save comments
export const saveComments = async (req, res) => {
    try {
        let { token } = req.headers
        const user = decodeToken(token)
        let { nguoi_dung_id } = user.data
        let { noi_dung, hinh_id } = req.body
        let ngay_binh_luan = new Date()
        const comment = await prisma.binh_luan.create({
            data: {
                hinh_id: hinh_id,
                nguoi_dung_id: nguoi_dung_id,
                noi_dung: noi_dung,
                ngay_binh_luan: ngay_binh_luan
            }
        })
        res.json(comment)
    } catch {
        res.status(400).json({
            message: "err",
        });
    }

}
// delele image
export const deleteImage = async (req, res) => {
    try {
        let { token } = req.headers
        let { imageId } = req.params
        const user = decodeToken(token)
        const { nguoi_dung_id } = user.data
        // Xóa hình ảnh chỉ khi người dùng truyền hinh_id và hinh_id thuộc về người dùng hiện tại
        const deletedImage = await prisma.hinh_anh.delete({
            where: {
                hinh_id: parseInt(imageId, 10),
                nguoi_dung_id: nguoi_dung_id
            }
        });

        res.json(deletedImage);
    } catch (error) {
        res.status(403).json({ error: 'delete image fail' });
    }

}
// add image
export const addImage = async (req, res) => {
    try {
        let { token } = req.headers
        const user = decodeToken(token)
        let { nguoi_dung_id } = user.data
        let { ten_hinh, duong_dan, mo_ta } = req.body

        // Sử dụng req.file để truy cập thông tin về tệp tin được tải lên
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'Không có file được tải lên' });
        }

        // Xử lý thông tin của tệp tin và lưu vào cơ sở dữ liệu
        const dataImage = await prisma.hinh_anh.create({
            data: {
                nguoi_dung_id: nguoi_dung_id,
                ten_hinh: ten_hinh,
                duong_dan: duong_dan,
                mo_ta: mo_ta,
                ten_file: file.filename, // Ví dụ: Lưu tên file vào cơ sở dữ liệu
                // Thêm các thông tin tệp tin khác nếu cần
            }
        })
        res.json(dataImage)
    } catch (error) {
        console.error("Lỗi khi tạo ảnh: ", error)
        res.status(404).json({ message: "Tạo ảnh thất bại" })
    }
}