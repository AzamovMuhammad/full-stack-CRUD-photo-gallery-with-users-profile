const express = require("express");
const { imgsUser, addImgs, deleteImages } = require("../controllers/myPhotosController");
const {authentication} = require("../middleware/authentication");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const myPhotosRouter = express.Router();

myPhotosRouter.post('/imgs', authentication, imgsUser)
myPhotosRouter.post('/addImg', authentication, uploadMiddleware, addImgs)
myPhotosRouter.post('/deleteImg', authentication, deleteImages)

module.exports = myPhotosRouter;