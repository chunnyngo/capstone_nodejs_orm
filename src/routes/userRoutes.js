import express from 'express';
import { getImageByUserId, getUser, userLogin, userRegister, saveComments, deleteImage, addImage } from '../controllers/userController.js';
import { protect } from '../controllers/tokenController.js';
import { updateUserInfo, upload } from '../controllers/uploadController.js';
const userRoute = express.Router();
//dang ki
userRoute.post("/user-register", userRegister);
// dang nhap
userRoute.post("/user-login", userLogin)
// get user
userRoute.get("/get-user", protect, getUser)
// get image by user id
userRoute.get("/get-image-by-user-id", protect, getImageByUserId)
// save comment
userRoute.post("/save-comment", protect, saveComments)
// delete image by user id
userRoute.delete("/delete-image/:imageId", protect, deleteImage)
// add image
userRoute.post("/add-image", upload.single("file"), protect, addImage)
// upload info
userRoute.put("/upload-info", upload.single("file"), protect, updateUserInfo);
export default userRoute; 