const express = require("express");
const { imgsUser, addImgs, deleteImages } = require("../controllers/myPhotosController");
const {authentication} = require("../middleware/authentication");
const myPhotosRouter = express.Router();

myPhotosRouter.post('/imgs', authentication, imgsUser)
myPhotosRouter.post('/addImg', authentication, addImgs)
myPhotosRouter.post('/deleteImg', authentication, deleteImages)

module.exports = myPhotosRouter;