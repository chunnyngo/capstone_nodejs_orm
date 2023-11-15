import express from 'express';
import { checkSaveImage, getComment, getImage, getImageById, getImageByName } from '../controllers/imageController.js';


const imageRoute = express.Router();

// get image
imageRoute.get("/get-image", getImage)
// get image by name
imageRoute.get("/get-image-by-name", getImageByName)
// get image & user by id
imageRoute.get("/get-image-by-id/:imageId", getImageById)
// get comment by image id
imageRoute.get("/get-comment/:imageId", getComment)
// check image save
imageRoute.get("/check-save-image/:imageId", checkSaveImage)

export default imageRoute;
