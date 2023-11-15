import multer, { diskStorage } from "multer";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export const upload = multer({
    storage: diskStorage({
        // process.cwd(): tra ve duong dan goc => node34
        destination: process.cwd() + "/public/img", // duong dan file se dc luu
        filename: (req, file, callback) => {
            let newName = new Date().getTime() + "_" + file.originalname;
            // lay ten hien tai cua hinh tu FE de gan vao BE, ko trung => 20231010111123999_lion.jpg
            callback(null, newName);
        }, // doi ten file
    }),
});

export const updateUserInfo = async (req, res) => {
    try {
        let { token } = req.headers;
        const user = decodeToken(token);
        let { nguoi_dung_id } = user.data;
        let { ho_ten, tuoi } = req.body;

        // Xử lý tệp tin ảnh được gửi lên
        const file = req.file;
        let avatar = null;
        if (file) {
            // Nếu có tệp tin ảnh được gửi lên, lưu tên tệp tin vào cơ sở dữ liệu
            avatar = file.filename;
        }

        // Cập nhật thông tin người dùng trong cơ sở dữ liệu
        const updatedUserInfo = await prisma.nguoi_dung.update({
            where: { nguoi_dung_id },
            data: {
                ho_ten: ho_ten,
                tuoi: tuoi,
                anh_dai_dien: avatar // Gán tên tệp tin ảnh vào trường anh_dai_dien
            }
        });

        res.json(updatedUserInfo); // Trả về thông tin người dùng sau khi được cập nhật
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin người dùng: ", error);
        res.status(500).json({ message: "Lỗi khi cập nhật thông tin người dùng" });
    }
};
