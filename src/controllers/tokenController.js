import { PrismaClient } from "@prisma/client";
import { decodeToken } from "../configs/jwt.js";
const prisma = new PrismaClient()
export const protect = async (req, res, next) => {
    const { token } = req.headers;

    try {
        if (!token) {
            return res.status(400).json("Không đủ quyền");
        }

        const user = decodeToken(token);

        const userExist = await prisma.nguoi_dung.findUnique({
            where: { nguoi_dung_id: user.data.nguoi_dung_id }
        });

        if (!userExist) {
            return res.status(400).json("Không đủ quyền");
        }

        req.body = {
            ...req.body,
            ...userExist.dataValues,
        };

        next();
    } catch (error) {
        console.error('Error during token validation:', error);
        return res.status(500).json("Lỗi server");
    }
};
