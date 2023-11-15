import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
// get image
export const getImage = async (req, res) => {
    const lstImage = await prisma.hinh_anh.findMany({
        select: {
            hinh_id: true,
            ten_hinh: true,
            duong_dan: true,
            mo_ta: true,
        },
    })
    res.send(lstImage)
}
// get image by name
export const getImageByName = async (req, res) => {
    let { imageName } = req.body
    const lstImageByName = await prisma.hinh_anh.findMany({
        where: {
            ten_hinh: {
                contains: imageName
            }
        },
    })
    res.send(lstImageByName)
}
// get infor user and image by image id
export const getImageById = async (req, res) => {
    let { imageId } = req.params
    const image = await prisma.hinh_anh.findUnique({
        where: {
            hinh_id: parseInt(imageId, 10)
        },
        include: {
            nguoi_dung: true
        }

    })
    res.send(image)
}
// get comments by image id
export const getComment = async (req, res) => {
    let { imageId } = req.params
    const comment = await prisma.binh_luan.findMany({
        where: {
            hinh_id: parseInt(imageId, 10)
        }
    })
    res.send(comment)
}
// check image save or not

export const checkSaveImage = async (req, res) => {
    let { imageId } = req.params
    const image = await prisma.hinh_anh.findUnique({
        where: {
            hinh_id: parseInt(imageId, 10)
        },
        include: {
            luu_anh: {
                where: {
                    hinh_id: parseInt(imageId, 10)
                }
            }
        }
    })
    if (!image) {
        res.send("chua luu")
    } else {
        res.send("da luu")
    }


}



