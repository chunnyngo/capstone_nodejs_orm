import express from 'express';
import imageRoute from './imageRoute.js';
import userRoute from './userRoutes.js';

const rootRoute = express.Router();
rootRoute.use("/image", imageRoute);
rootRoute.use("/user", userRoute);
export default rootRoute